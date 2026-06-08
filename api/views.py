import tensorflow as tf
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from PIL import Image
import numpy as np
import os
import joblib
from .gemini_service import generate_health_recommendation

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, '4_class_simple_cnn_v5.h5')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.joblib')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_encoder.joblib')

# --- Load AI Model and Preprocessors ---
try:
    print(f"[!] Loading model from: {MODEL_PATH}")
    print(f"[!] Loading scaler from: {SCALER_PATH}")
    print(f"[!] Loading label encoder from: {LABEL_ENCODER_PATH}")
    
    model = tf.keras.models.load_model(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(LABEL_ENCODER_PATH)
    
    print("[*] Model and preprocessors loaded successfully!")
    print(f"[*] Model input shape: {model.input_shape if hasattr(model, 'input_shape') else 'Multiple inputs'}")
    print(f"[*] Scaler features: {getattr(scaler, 'n_features_in_', 'Not available')}")
    print(f"[*] Label encoder classes: {getattr(label_encoder, 'classes_', 'Not available')}")
except Exception as e:
    import traceback
    print(f"[X] Error loading model or preprocessors: {e}")
    traceback.print_exc()
    model = None

class PredictView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if not model:
            return Response({"error": "AI model is not available."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            # --- Get data from the request ---
            image_file = request.data.get('image')
            age = request.data.get('age')
            gender = request.data.get('gender', 'Male')
            tobacco_use = request.data.get('tobacco_use', 'No')
            
            # Validate required fields
            if not image_file:
                return Response({"error": "Image file is required."}, status=status.HTTP_400_BAD_REQUEST)
            if not age or age == '':
                return Response({"error": "Age is required."}, status=status.HTTP_400_BAD_REQUEST)

            # --- Preprocess Image and Tabular Data ---
            image = Image.open(image_file).convert('RGB')
            image_resized = image.resize((224, 224))
            image_array = np.array(image_resized) / 255.0
            image_batch = np.expand_dims(image_array, axis=0)

            # --- Fix: Create 3-feature input as expected by the model ---
            gender_numeric = 1 if str(gender).lower() == 'male' else 0
            
            # Better tobacco encoding
            tobacco_str = str(tobacco_use).lower()
            if tobacco_str in ['no', 'none', '0', 'false']:
                tobacco_numeric = 0
            elif tobacco_str in ['smoker', 'smoking', 'cigarette']:
                tobacco_numeric = 1
            elif tobacco_str in ['smokeless', 'chewing', 'smokeless/chewing']:
                tobacco_numeric = 2
            else:
                tobacco_numeric = 1  # Default to smoker if unclear
                
            print(f"[!] Encoding - Gender: {gender} -> {gender_numeric}, Tobacco: {tobacco_use} -> {tobacco_numeric}")
            
            # Create 3-feature array for the model (age, gender, tobacco)
            tabular_data = np.array([[float(age), gender_numeric, tobacco_numeric]])
            
            # Scale the data
            tabular_data_scaled = scaler.transform(tabular_data)

            # --- Make a Real Prediction ---
            print(f"[!] Input shapes - Image: {image_batch.shape}, Tabular: {tabular_data_scaled.shape}")
            print(f"[!] Tabular data: {tabular_data_scaled}")
            
            prediction_probs = model.predict([image_batch, tabular_data_scaled])
            print(f"[!] Raw prediction probabilities: {prediction_probs}")
            print(f"[!] Prediction shape: {prediction_probs.shape}")
            
            # --- Format the Response ---
            predicted_class_index = np.argmax(prediction_probs)
            print(f"[!] Predicted class index: {predicted_class_index}")
            
            try:
                predicted_class_name = label_encoder.inverse_transform([predicted_class_index])[0]
            except Exception as e:
                fallback_classes = ['Healthy', 'Leukoplakia', 'Lichen_Planus', 'Oral_Cancer']
                if predicted_class_index < len(fallback_classes):
                    predicted_class_name = fallback_classes[predicted_class_index]
                else:
                    predicted_class_name = f"Unknown (Index {predicted_class_index})"
                print(f"[!] Label encoder lookup failed. Using fallback class: {predicted_class_name}")

            confidence_score = float(np.max(prediction_probs))
            
            print(f"[!] Final prediction: {predicted_class_name} with confidence: {confidence_score}")
            
            # Add all class probabilities for debugging
            all_classes = list(label_encoder.classes_)
            fallback_classes = ['Healthy', 'Leukoplakia', 'Lichen_Planus', 'Oral_Cancer']
            if len(prediction_probs[0]) == len(fallback_classes):
                all_classes = fallback_classes
                
            class_probabilities = {}
            for i, class_name in enumerate(all_classes):
                class_probabilities[class_name] = float(prediction_probs[0][i]) if len(prediction_probs.shape) > 1 else float(prediction_probs[i])
            
            print(f"[!] All class probabilities: {class_probabilities}")

            response_data = {
                "predicted_class": predicted_class_name,
                "confidence_score": confidence_score,
                "all_predictions": class_probabilities,
                "debug_info": {
                    "input_age": float(age),
                    "input_gender": gender,
                    "input_tobacco": tobacco_use,
                    "processed_tabular": tabular_data_scaled.tolist(),
                    "image_shape": list(image_batch.shape)
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print(f"[X] Prediction error: {e}")
            print(f"[X] Full traceback:")
            traceback.print_exc()
            return Response({"error": f"An error occurred during prediction: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GeminiChatView(APIView):
    """
    API endpoint for Gemini-powered health recommendations
    """
    parser_classes = (JSONParser,)

    def post(self, request, *args, **kwargs):
        try:
            prompt = request.data.get('prompt', '')
            
            if not prompt:
                return Response(
                    {"error": "Prompt is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print(f"[>] Gemini request: {prompt[:100]}...")
            
            # Generate response using Gemini
            ai_response = generate_health_recommendation(prompt)
            
            print(f"[+] Gemini response generated: {ai_response[:100]}...")
            
            return Response({
                "response": ai_response,
                "status": "success"
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            import traceback
            print(f"[X] Gemini chat error: {e}")
            traceback.print_exc()
            return Response(
                {"error": f"An error occurred: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
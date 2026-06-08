import os
import joblib
import numpy as np
import tensorflow as tf
from PIL import Image

# Setup paths
BASE_DIR = os.getcwd()
MODEL_PATH = os.path.join(BASE_DIR, '4_class_simple_cnn_v5.h5')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler .joblib')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_encoder .joblib')

def test_prediction():
    print("--- Starting Reproduction Test ---")
    
    # 1. Load Resources
    try:
        print(f"Loading model from {MODEL_PATH}")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded.")
        
        print(f"Loading scaler from {SCALER_PATH}")
        scaler = joblib.load(SCALER_PATH)
        print("Scaler loaded.")
        
        print(f"Loading label encoder from {LABEL_ENCODER_PATH}")
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        print("Label encoder loaded.")
        
    except Exception as e:
        print(f"FATAL: Error loading resources: {e}")
        return

    # 2. Mock Input Data
    # We need a dummy image
    image_shape = (224, 224, 3)
    dummy_image = np.random.rand(1, *image_shape).astype(np.float32)
    print(f"Created dummy image with shape {dummy_image.shape}")

    # Mock tabular data: Age=50, Gender=Male(1), Tobacco=No(0)
    age = 50.0
    gender_numeric = 1
    tobacco_numeric = 0
    
    tabular_data = np.array([[age, gender_numeric, tobacco_numeric]])
    print(f"Created dummy tabular data: {tabular_data}")

    # 3. Process Tabular Data
    try:
        print("Transforming tabular data...")
        tabular_data_scaled = scaler.transform(tabular_data)
        print(f"Scaled tabular data: {tabular_data_scaled}")
    except Exception as e:
        print(f"FATAL: Error scaling data: {e}")
        return

    # 4. Predict
    try:
        print("Running prediction...")
        prediction_probs = model.predict([dummy_image, tabular_data_scaled])
        print(f"Prediction probs: {prediction_probs}")
        
        predicted_class_index = np.argmax(prediction_probs)
        predicted_class_name = label_encoder.inverse_transform([predicted_class_index])[0]
        print(f"Predicted class: {predicted_class_name}")
        
    except Exception as e:
        print(f"FATAL: Error during prediction: {e}")
        return

    print("--- Test Completed Successfully ---")

if __name__ == "__main__":
    test_prediction()

import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
try:
    import google.generativeai as genai
except ImportError:
    # Fallback/Mock if SDK not installed/compatible
    genai = None

from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if genai and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')
else:
    gemini_model = None
    print("Warning: Gemini API not configured or SDK missing.")

app = Flask(__name__)
CORS(app)

# Load your specific model
# NOTE: Adjusted path to look in project root if not found in models/
MODEL_PATH = "models/oral_model_v11.h5"
DEFAULT_MODEL_PATH = "../4_class_simple_cnn_v5.h5" # Fallback to existing model in root

model = None
try:
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print(f"Model Loaded from {MODEL_PATH}")
    elif os.path.exists(DEFAULT_MODEL_PATH):
        model = load_model(DEFAULT_MODEL_PATH)
        print(f"Model Loaded from {DEFAULT_MODEL_PATH}")
    else:
        # Try absolute path based on known project structure
        abs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "4_class_simple_cnn_v5.h5")
        if os.path.exists(abs_path):
            model = load_model(abs_path)
            print(f"Model Loaded from {abs_path}")
        else:
             print("WARNING: Model not found. Predictions will fail.")
except Exception as e:
    print(f"Error loading model: {e}")

class_names = ['Healthy', 'Leukoplakia', 'Lichen_Planus', 'Oral_Cancer']

@app.route('/predict', methods=['POST'])
def predict():
    if not model: return jsonify({"error": "Model missing"}), 500
    if 'file' not in request.files: return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    try:
        img = Image.open(file).convert('RGB').resize((224, 224))
        arr = np.expand_dims(img_to_array(img) / 255.0, axis=0)
        
        pred = model.predict(arr)
        idx = np.argmax(pred)
        
        # Ensure index is within bounds of class_names
        if idx >= len(class_names):
             predicted_class = f"Unknown (Index {idx})"
        else:
             predicted_class = class_names[idx]
             
        return jsonify({ "class": predicted_class, "confidence": float(np.max(pred) * 100) })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_wellness_info', methods=['POST'])
def get_wellness():
    if not gemini_model:
        return jsonify({"html_content": "<p><strong>AI Assistant Unavailable.</strong> Please configure API Key.</p>"})
        
    condition = request.json.get("condition")
    prompt = f"Explain pathophysiology, clinical features, and 3 diet tips for {condition} in HTML format."
    try:
        res = gemini_model.generate_content(prompt)
        return jsonify({"html_content": res.text})
    except Exception as e:
        return jsonify({"html_content": f"<p>Error generating content: {str(e)}</p>"})

if __name__ == '__main__':
    app.run(port=5000, debug=True)

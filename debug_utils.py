import os
import joblib
import numpy as np
import tensorflow as tf

# Setup paths
BASE_DIR = os.getcwd()
MODEL_PATH = os.path.join(BASE_DIR, '4_class_simple_cnn_v5.h5')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_encoder .joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler .joblib')  # Added scaler path

def test_label_encoder():
    print("--- Inspecting Label Encoder ---")
    
    try:
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        print(f"Type: {type(label_encoder)}")
        print(f"Classes: {label_encoder.classes_}")
        
        # Test inverse transform manually
        print("Testing inverse_transform for indices 0, 1, 2:")
        try:
            print(f"0 -> {label_encoder.inverse_transform([0])}")
        except Exception as e:
            print(f"0 -> ERROR: {e}")
            
        try:
            print(f"1 -> {label_encoder.inverse_transform([1])}")
        except Exception as e:
            print(f"1 -> ERROR: {e}")
            
        try:
            print(f"2 -> {label_encoder.inverse_transform([2])}")
        except Exception as e:
            print(f"2 -> ERROR: {e}")

        try:
            print(f"3 -> {label_encoder.inverse_transform([3])}")
        except Exception as e:
            print(f"3 -> ERROR: {e}")

    except Exception as e:
        print(f"FATAL: Error loading/testing encoder: {e}")

def test_scaler():
    print("\n--- Inspecting Scaler ---")
    try:
        scaler = joblib.load(SCALER_PATH)
        print(f"Type: {type(scaler)}")
        # Check if it has any encoding properties
        if hasattr(scaler, 'categories_'):
             print(f"Categories: {scaler.categories_}")
        if hasattr(scaler, 'mean_'):
             print(f"Mean: {scaler.mean_}")
             
    except Exception as e:
        print(f"FATAL: Error loading/testing scaler: {e}")

if __name__ == "__main__":
    test_label_encoder()
    test_scaler()

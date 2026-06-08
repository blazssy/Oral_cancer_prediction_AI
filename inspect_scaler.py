import joblib

try:
    scaler = joblib.load('scaler.joblib')
    print(f"Scaler loaded successfully.")
    print(f"Number of features expected: {scaler.n_features_in_}")
    
    if hasattr(scaler, 'feature_names_in_'):
        print(f"Feature names: {scaler.feature_names_in_}")
    else:
        print("Scaler does not contain feature names.")

    print(f"Scaler mean values: {scaler.mean_}")
    print(f"Scaler scale (std dev): {scaler.scale_}")

except Exception as e:
    print(f"Error inspecting scaler: {e}")

import requests
import os
from PIL import Image
import io

def test_api():
    url = 'http://127.0.0.1:8000/api/predict/'
    
    # Create a valid dummy image (Red square)
    img = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    files = {'image': ('test.png', img_byte_arr, 'image/png')}
    data = {
        'age': '50',
        'gender': 'Male',
        'tobacco_use': 'No'
    }
    
    try:
        print(f"Sending POST request to {url}...")
        response = requests.post(url, files=files, data=data)
        
        print(f"Status Code: {response.status_code}")
        try:
            print("Response Body JSON:")
            print(response.json())
        except:
            print("Response Body Text:")
            print(response.text)
        
        if response.status_code == 200:
            print("SUCCESS: API call worked.")
        else:
            print("FAILURE: API returned error.")
            
    except requests.exceptions.ConnectionError:
        print("FAILURE: Could not connect to server. Is it running?")
    except Exception as e:
        print(f"FAILURE: An error occurred: {e}")

if __name__ == "__main__":
    test_api()

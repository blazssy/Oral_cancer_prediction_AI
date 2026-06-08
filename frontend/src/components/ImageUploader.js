// src/components/ImageUploader.js
import React from 'react';

function ImageUploader({ handleImageChange, previewImage }) {
  const onFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleImageChange(event.target.files[0]);
    }
  };

  return (
    <div className="uploader-container card">
      <h2>Clinical Image</h2>
      <div className="uploader-box">
        {previewImage ? (
          <img src={previewImage} alt="Preview" className="image-preview" />
        ) : (
          <div className="uploader-prompt">
            <span>📤</span>
            <p>Click to browse or drag & drop</p>
          </div>
        )}
        <input type="file" onChange={onFileChange} accept="image/png, image/jpeg, image/jpg" />
      </div>
    </div>
  );
}

export default ImageUploader;
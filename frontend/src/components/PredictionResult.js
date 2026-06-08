// src/components/PredictionResult.js
import React from 'react';

function PredictionResult({ prediction, isLoading }) {
  if (isLoading) {
    return (
      <div className="results-container card loading-state">
        <div className="spinner"></div>
        <p>Analyzing, please wait...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="results-container card">
        <h2>Results Panel</h2>
        <p className="placeholder-text">Analysis results will appear here.</p>
      </div>
    );
  }

  return (
    <div className="results-container card">
      <h2>Analysis Results</h2>
      <div className="result-item">
        <h3>Predicted Condition</h3>
        <p className="prediction-class">{prediction.predicted_class || 'N/A'}</p>
      </div>
      <div className="result-item">
        <h3>Confidence Score</h3>
        <div className="confidence-bar-container">
          <div className="confidence-bar" style={{ width: `${(prediction.confidence_score || 0) * 100}%` }}></div>
        </div>
        <p className="confidence-score">{(prediction.confidence_score * 100).toFixed(2)}%</p>
      </div>
    </div>
  );
}

export default PredictionResult;
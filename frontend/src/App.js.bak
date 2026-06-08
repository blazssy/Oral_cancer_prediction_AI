import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

// --- Component Imports ---
import Scene3D from './components/Scene3D';
import PatientForm from './components/PatientForm';
import ImageUploader from './components/ImageUploader';
import PredictionResult from './components/PredictionResult';
import EtiologyMap from './components/EtiologyMap';
import Globe from './components/Globe';
import WellnessAgent from './components/WellnessAgent';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [patientData, setPatientData] = useState({ age: '', gender: 'Male', tobaccoUse: 'No' });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiQuestions, setAiQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  
  // Refs for smooth scrolling
  const heroRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const globeRef = useRef(null);
  const aiChatRef = useRef(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please upload an image.');
      return;
    }
    setError('');
    setIsLoading(true);
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('age', patientData.age);
    formData.append('gender', patientData.gender);
    formData.append('tobacco_use', patientData.tobaccoUse);

    try {
      // Connect to the Django backend
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
      
      // Initialize AI questions based on prediction
      initializeAIQuestions(response.data);
      
      // Smooth scroll to results section
      setTimeout(() => {
        scrollToSection(resultsRef);
      }, 500);
      
    } catch (err) {
      setError('Analysis failed. Please check the backend server and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleGetStarted = () => {
    setCurrentSection(1);
    scrollToSection(inputRef);
  };

  const initializeAIQuestions = (predictionData) => {
    const questions = [
      "What's your current diet like? Do you eat a lot of spicy or processed foods?",
      "How often do you consume tobacco or alcohol?",
      "What's the weather like in your area? Hot and humid or dry?",
      "Do you have any family history of oral conditions?",
      "How often do you visit a dentist for check-ups?"
    ];
    setAiQuestions(questions);
    setCurrentQuestionIndex(0);
  };

  const handleAIResponse = (response) => {
    setUserResponses(prev => ({
      ...prev,
      [currentQuestionIndex]: response
    }));
    
    if (currentQuestionIndex < aiQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div className="App">
      {/* Navigation Header - Fixed */}
      <nav className="nav-header">
        <div className="nav-brand">OralScan AI</div>
        <ul className="nav-menu">
          <li onClick={() => scrollToSection(heroRef)}>Home</li>
          <li onClick={() => scrollToSection(inputRef)}>Predictor</li>
          <li onClick={() => scrollToSection(globeRef)}>Global Map</li>
          <li onClick={() => scrollToSection(aiChatRef)}>AI Assistant</li>
        </ul>
        <button className="nav-auth">Login/Set Up</button>
      </nav>

      {/* Section 1: Hero Landing */}
      <section ref={heroRef} className="hero-section-full">
        <Scene3D onModelClick={handleGetStarted} />
      </section>

      {/* Section 2: Input Form */}
      <section ref={inputRef} className="input-section">
        <motion.div 
          className="input-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Let's Analyze Your Condition</h2>
          <div className="input-form-card">
            <PatientForm patientData={patientData} handleFormChange={handleFormChange} />
            <ImageUploader handleImageChange={handleImageChange} previewImage={previewImage} />
            <button onClick={handleAnalyze} disabled={isLoading} className="analyze-button">
              {isLoading ? 'Analyzing...' : 'Analyze Lesion'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </motion.div>
      </section>

      {/* Section 3: Results & Charts */}
      {prediction && (
        <section ref={resultsRef} className="results-section">
          <motion.div 
            className="results-container-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Analysis Results</h2>
            
            <div className="results-grid">
              {/* Prediction Card */}
              <motion.div 
                className="result-card prediction-result-card"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="prediction-header">Prediction Results</div>
                <h3 className="prediction-title">
                  {prediction.predicted_class}
                </h3>
                
                <div className="confidence-section">
                  <div className="confidence-label">Confidence Score</div>
                  <div className="confidence-score">{Math.round(prediction.confidence_score * 100)}%</div>
                </div>

                {/* Display all class probabilities */}
                {prediction.all_predictions && (
                  <div className="all-predictions">
                    <h4>Detailed Probabilities</h4>
                    {Object.entries(prediction.all_predictions).map(([className, probability]) => (
                      <div key={className} className="probability-item">
                        <span className="class-name">{className}:</span>
                        <div className="probability-bar-container">
                          <div 
                            className="probability-bar" 
                            style={{ width: `${probability * 100}%` }}
                          />
                        </div>
                        <span className="probability-value">{(probability * 100).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="condition-description">
                  <h4>About This Condition</h4>
                  <p>
                    {prediction.predicted_class === 'Leukoplakia' ? 
                      'Leukoplakia is a white patch or plaque that develops in the oral cavity. It is considered a potentially malignant disorder that requires monitoring and may need biopsy for definitive diagnosis.' :
                      prediction.predicted_class === 'Lichen_Planus' ?
                      'Oral Lichen Planus is a chronic inflammatory condition affecting the mucous membranes. While generally benign, certain forms may have a small risk of malignant transformation and require regular monitoring.' :
                      'Analysis complete. Please consult with a healthcare professional for proper diagnosis and treatment recommendations.'
                    }
                  </p>
                </div>
              </motion.div>

              {/* Risk Factors Card */}
              <motion.div 
                className="result-card risk-factors-card"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4>Risk Factor Analysis</h4>
                
                {/* Age Risk */}
                <div className="risk-factor-item">
                  <div className="risk-factor-header">
                    <span className="risk-icon">👤</span>
                    <div className="risk-info">
                      <span className="risk-label">Age Factor</span>
                      <span className="risk-detail">{patientData.age} years old</span>
                    </div>
                    <span className={`risk-badge ${patientData.age > 40 ? 'high-risk' : 'low-risk'}`}>
                      {patientData.age > 40 ? 'High Risk' : 'Low Risk'}
                    </span>
                  </div>
                  <div className="risk-progress-bar">
                    <div 
                      className={`risk-progress-fill ${patientData.age > 40 ? 'high' : 'low'}`}
                      style={{ width: `${Math.min((patientData.age / 80) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Tobacco Risk */}
                <div className="risk-factor-item">
                  <div className="risk-factor-header">
                    <span className="risk-icon">🚬</span>
                    <div className="risk-info">
                      <span className="risk-label">Tobacco Use</span>
                      <span className="risk-detail">{patientData.tobaccoUse}</span>
                    </div>
                    <span className={`risk-badge ${patientData.tobaccoUse !== 'No' ? 'high-risk' : 'low-risk'}`}>
                      {patientData.tobaccoUse !== 'No' ? 'High Risk' : 'Low Risk'}
                    </span>
                  </div>
                  <div className="risk-progress-bar">
                    <div 
                      className={`risk-progress-fill ${patientData.tobaccoUse !== 'No' ? 'high' : 'low'}`}
                      style={{ width: patientData.tobaccoUse === 'No' ? '20%' : patientData.tobaccoUse === 'Smoker' ? '80%' : '90%' }}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="risk-factor-item">
                  <div className="risk-factor-header">
                    <span className="risk-icon">{patientData.gender === 'Male' ? '👨' : '👩'}</span>
                    <div className="risk-info">
                      <span className="risk-label">Gender</span>
                      <span className="risk-detail">{patientData.gender}</span>
                    </div>
                    <span className="risk-badge neutral">
                      {patientData.gender === 'Male' ? 'Higher Prevalence' : 'Lower Prevalence'}
                    </span>
                  </div>
                  <div className="risk-progress-bar">
                    <div 
                      className="risk-progress-fill neutral"
                      style={{ width: patientData.gender === 'Male' ? '60%' : '40%' }}
                    />
                  </div>
                </div>

                {/* Overall Risk Summary */}
                <div className="overall-risk-summary">
                  <div className="summary-header">Overall Risk Score</div>
                  <div className="summary-score">
                    {Math.round(prediction.confidence_score * 100)}%
                  </div>
                  <div className="summary-description">
                    Based on AI analysis and risk factors
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Section 4: Animated Globe */}
      <section ref={globeRef} className="globe-section">
          <motion.div 
            className="globe-container-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Global Prevalence Map</h2>
            <Globe />
            <div className="prevalence-info">
              <h3>Premalignant Lesion Hotspots</h3>
              <div className="region-stats">
                <div className="stat-item">
                  <span className="region">South Asia</span>
                  <span className="percentage">45%</span>
                </div>
                <div className="stat-item">
                  <span className="region">Southeast Asia</span>
                  <span className="percentage">38%</span>
                </div>
                <div className="stat-item">
                  <span className="region">Eastern Europe</span>
                  <span className="percentage">28%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      {/* Section 5: AI Personalized Chat */}
      {prediction && (
        <section ref={aiChatRef} className="ai-chat-section">
          <motion.div 
            className="ai-chat-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Personalized AI Health Assistant</h2>
            <WellnessAgent prediction={prediction} patientData={patientData} />
          </motion.div>
        </section>
      )}
    </div>
  );
}

export default App;

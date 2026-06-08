import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Globe3D from './components/Globe3D';
import RiskRadarChart from './components/RiskRadarChart';

const Dashboard = () => {
    const [result, setResult] = useState(null);
    const [wellness, setWellness] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:5000/predict', formData);
            setResult(res.data);

            const wellRes = await axios.post('http://localhost:5000/get_wellness_info', { condition: res.data.class });
            setWellness(wellRes.data.html_content);
        } catch (error) {
            console.error("Error during analysis:", error);
            alert("Analysis failed. Is the Flask backend running on port 5000?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            {/* BACKGROUND: Fixed Globe */}
            <div id="scene-globe">
                <Globe3D />
            </div>

            {/* FOREGROUND: Analysis Panel */}
            <section id="scene-analysis">
                <div className="analysis-wrapper">

                    <div className="header-section">
                        <h1 className="app-title">OralScan AI</h1>
                        <p className="app-subtitle">Advanced Oral Cancer Detection System</p>
                    </div>

                    <div className="content-grid">
                        {/* Left Column: Upload & Results */}
                        <div className="left-column">
                            <div className="upload-card">
                                <h2 className="card-title">Upload Clinical Image</h2>
                                <label htmlFor="file-upload" className="file-upload-label">
                                    <div className="upload-icon">📤</div>
                                    <span className="upload-text">Click to select image</span>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleUpload}
                                        accept="image/*"
                                        className="file-input"
                                    />
                                </label>
                                {loading && <div className="loading-indicator">Analyzing image...</div>}
                            </div>

                            {result && (
                                <div className="results-card">
                                    <div className="result-header">
                                        <h2 className="result-title">{result.class}</h2>
                                        <div className="confidence-badge">{result.confidence.toFixed(1)}%</div>
                                    </div>

                                    {wellness && (
                                        <div className="wellness-content" dangerouslySetInnerHTML={{ __html: wellness }} />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Risk Analysis */}
                        <div className="right-column">
                            <div className="risk-card">
                                <h2 className="card-title">Patient Risk Profile</h2>
                                <div className="chart-container">
                                    <RiskRadarChart />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="scroll-indicator">
                        <span className="scroll-text">↓ Scroll to Reveal Global Data ↓</span>
                    </div>
                </div>
            </section>

            {/* SPACER: Triggers the Reveal */}
            <section id="scroll-spacer"></section>
        </div>
    );
};
export default Dashboard;

// src/components/PatientForm.js
import React from 'react';

function PatientForm({ patientData, handleFormChange }) {
  return (
    <div className="form-container card">
      <h2>Patient & Lesion Data</h2>
      <div className="form-group">
        <label htmlFor="age">Patient Age</label>
        <input 
          type="number" id="age" name="age" placeholder="e.g., 55"
          value={patientData.age} onChange={handleFormChange} 
        />
      </div>
      <div className="form-group">
        <label htmlFor="gender">Patient Gender</label>
        <select id="gender" name="gender" value={patientData.gender} onChange={handleFormChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="tobaccoUse">Tobacco Use</label>
        <select id="tobaccoUse" name="tobaccoUse" value={patientData.tobaccoUse} onChange={handleFormChange}>
          <option value="No">No</option>
          <option value="Smoker">Smoker</option>
          <option value="Smokeless/Chewing">Smokeless/Chewing</option>
        </select>
      </div>
    </div>
  );
}

export default PatientForm;
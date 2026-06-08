import React from 'react';
import { motion } from 'framer-motion';

function Scene3D({ onModelClick }) {
  return (
    <motion.div 
      className="hero-landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      {/* Navigation Header */}
      <nav className="nav-header">
        <div className="nav-brand">OralScan AI</div>
        <ul className="nav-menu">
          <li>Predictor</li>
          <li>Dashboard Map</li>
          <li>Health Feed</li>
        </ul>
        <button className="nav-auth">Login/Set Up</button>
      </nav>

      <div className="hero-background">
        {/* Floating Particles */}
        <div className="floating-elements">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Left Content */}
        <motion.div 
          className="hero-content"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Empower Your Health Journey
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Advanced AI for Early Detection & Personalized Care
          </motion.p>
          
          <motion.button
            className="hero-cta-button"
            onClick={onModelClick}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 40px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Right Visual - 3D Dental Model */}
        <motion.div 
          className="hero-visual"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="dental-model" onClick={onModelClick}>
            {/* This will be replaced with actual 3D model later */}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Scene3D;

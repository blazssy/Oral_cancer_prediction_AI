import React from 'react';

function Globe() {
  return (
    <div className="globe-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative',
      background: 'linear-gradient(135deg, #1a1d29 0%, #252836 100%)'
    }}>
      <div style={{
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6, #1e40af)',
        boxShadow: '0 0 60px rgba(59, 130, 246, 0.6), inset -20px -20px 40px rgba(0, 0, 0, 0.3)',
        animation: 'rotateGlobe 20s linear infinite',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Shine effect */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)',
          filter: 'blur(20px)'
        }} />
        
        {/* Globe emoji overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '200px',
          opacity: 0.3,
          animation: 'spin 30s linear infinite'
        }}>
          🌍
        </div>
      </div>
      
      <style>{`
        @keyframes rotateGlobe {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Globe;

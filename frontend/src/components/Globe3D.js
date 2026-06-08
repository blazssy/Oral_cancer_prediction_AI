import React from 'react';
import './Globe3D.css';

const Globe3D = () => {
    return (
        <div className="globe-container">
            <div className="globe">
                <div className="globe-sphere"></div>
                <div className="globe-atmosphere"></div>
            </div>
            <div className="stars"></div>
        </div>
    );
};

export default Globe3D;

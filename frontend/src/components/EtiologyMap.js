// src/components/EtiologyMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { geoData } from '../mapData';

function EtiologyMap() {
  const defaultPosition = [20, 0];

  return (
    <div className="map-container card">
      <h2>Global Etiology Map</h2>
      <div className="leaflet-map">
        <MapContainer center={defaultPosition} zoom={2} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData.map((location, index) => (
            <Marker key={index} position={location.position}>
              <Popup>
                <strong>{location.country}</strong><br />
                Notes: {location.notes}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default EtiologyMap;
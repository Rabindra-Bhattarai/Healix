"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Tribhuvan University Teaching Hospital, Maharajgunj, Kathmandu
const HOSPITAL_LOCATION: [number, number] = [27.7392, 85.3247];

const hospitalIcon = L.divIcon({
  className: "",
  html: `<div style="background:#574eb1;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white">
    <span style="transform:rotate(45deg);font-size:16px">🏥</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const patientIcon = L.divIcon({
  className: "",
  html: `<div style="background:#006c4e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function LocationMap() {
  const [patientLocation, setPatientLocation] = useState<[number, number] | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPatientLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setLocationDenied(true),
      { timeout: 8000 }
    );
  }, []);

  return (
    <div className="rounded-lg overflow-hidden border border-outline-variant/20">
      <MapContainer
        center={patientLocation ?? HOSPITAL_LOCATION}
        zoom={patientLocation ? 12 : 15}
        style={{ width: "100%", height: "192px" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={HOSPITAL_LOCATION} icon={hospitalIcon}>
          <Popup>Tribhuvan University Teaching Hospital</Popup>
        </Marker>
        {patientLocation && (
          <Marker position={patientLocation} icon={patientIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
      </MapContainer>
      {locationDenied && (
        <p className="text-center font-label-sm text-label-sm text-on-surface-variant py-2 bg-surface-container-low">
          Enable location access to see your position on the map.
        </p>
      )}
    </div>
  );
}

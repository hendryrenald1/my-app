import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "<<key>>", // Replace with your API key
  });

  const [location, setLocation] = useState({
    lat: 51.5074, // Default location (London)
    lng: -0.1278,
  });

  const [postcode, setPostcode] = useState("");

  const handleGeocode = async () => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=<<Key>>`;
    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ lat, lng });
      } else {
        alert("No location found for the given postcode!");
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Input Field for Postcode */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          onClick={handleGeocode}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4285F4",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Google Map */}
      <GoogleMap
        zoom={12}
        center={location}
        mapContainerStyle={{ width: "800px", height: "400px" }}
      >
        <Marker position={location} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;

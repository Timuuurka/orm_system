import React, { useRef, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { GoogleMap, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const libraries = ["places"];

const MapSearch = ({ onPlaceSelected }) => {
  const searchBoxRef = useRef(null);
  const [center, setCenter] = useState({ lat: 43.2389, lng: 76.8897 }); // Алматы

  const handlePlaceChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      onPlaceSelected(place);
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "80vh" }}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={13}
        >
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="Введите название бизнеса"
              style={{
                boxSizing: "border-box",
                border: "1px solid #ccc",
                width: "320px",
                height: "40px",
                padding: "0 12px",
                position: "absolute",
                top: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                backgroundColor: "white",
                borderRadius: "4px",
                fontSize: "14px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          </StandaloneSearchBox>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapSearch;

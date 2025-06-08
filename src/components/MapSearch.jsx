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
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
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
                border: "1px solid transparent",
                width: "300px",
                height: "40px",
                padding: "0 12px",
                marginTop: "10px",
                borderRadius: "4px",
                fontSize: "14px",
                outline: "none",
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 5,
              }}
            />
          </StandaloneSearchBox>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapSearch;

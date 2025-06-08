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
    <div className="w-[70%] max-w-4xl h-[60vh] mx-auto my-8 relative rounded-xl shadow-lg overflow-hidden">
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
              className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[280px] sm:w-[320px] h-10 px-4 text-sm border border-gray-300 rounded-md shadow-md z-10 focus:outline-none"
            />
          </StandaloneSearchBox>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapSearch;

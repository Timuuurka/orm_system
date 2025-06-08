import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { analyzeSentiment } from "../services/sentiment";
import { GOOGLE_MAPS_API_KEY } from "../config";



const Dashboard = () => {
    return (
<div style={{ marginTop: "2rem", textAlign: "center" }}>
  <h2 style={{ color: "#e91e63", fontSize: "2rem", fontWeight: "bold" }}>
    Я тебя люблю АЙЗЕРЕ<span style={{ color: "red", fontSize: "2.5rem" }}>❤️</span>
  </h2>
</div>

  );
};

export default Dashboard;

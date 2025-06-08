import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { GOOGLE_MAPS_API_KEY } from "../config";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePlaceSelected = async (place) => {
    try {
      console.log("Выбранный бизнес:", place);
      setSelectedBusiness(place);
      setLoading(true);

      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      setReviews(details.reviews || []);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке деталей места:", error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Добро пожаловать, {user?.name}</h1>
      <img src={user?.picture} alt="User" style={{ borderRadius: "50%" }} />
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Выйти
      </button>

      <div style={{ marginTop: "2rem" }}>
        <MapSearch onPlaceSelected={handlePlaceSelected} />
      </div>

      {selectedBusiness && (
        <div style={{ marginTop: "2rem" }}>
          <h2>{selectedBusiness.name}</h2>
          <p>{selectedBusiness.formatted_address}</p>
        </div>
      )}

      {loading && <p>Загрузка отзывов...</p>}

      {reviews.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Отзывы:</h2>
          {reviews.map((review, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>{review.author_name}</strong> (оценка: {review.rating})
              </p>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

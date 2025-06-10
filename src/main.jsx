import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ReviewsProvider } from "./context/ReviewsContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReviewsProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    </ReviewsProvider>
  </React.StrictMode>
);

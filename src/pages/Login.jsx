import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "366922518031-ggobvri20f0ia489nnrm0nd0oq3jpbhj.apps.googleusercontent.com";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const googleButtonRef = useRef(null);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => setGsiLoaded(true);
      document.head.appendChild(script);
    } else {
      setGsiLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (gsiLoaded && window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (credentialResponse) => {
          login(credentialResponse);
          navigate("/dashboard"); // ⬅️ Перенаправление после логина
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
      });

      window.google.accounts.id.prompt();
    }
  }, [gsiLoaded, login, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}>
      <h2>Вход через Google</h2>
      <div ref={googleButtonRef}></div>
    </div>
  );
};

export default Login;

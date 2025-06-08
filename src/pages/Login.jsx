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
          navigate("/dashboard");
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: "300",
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto w-20 h-20 rounded-full shadow"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to continue to ORM System</p>
        </div>
        <div ref={googleButtonRef} className="flex justify-center" />
        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline text-blue-600">Terms of Service</a> and{" "}
          <a href="/privacy" className="underline text-blue-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout"; 
export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // Auto redirect timer

  // Auto Redirect after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    setTimeout(() => navigate("/"), 10000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <MainLayout title="Page Not Found">
      <div className="flex flex-col items-center justify-center min-h-screen text-center">

        {/* 404 Message */}
        <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Oops! The page you're looking for doesn't exist. Redirecting in {countdown} seconds...
        </p>

        {/* Search Bar */}
        <div className="mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Search for content..."
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition">
            Search
          </button>
        </div>

        {/* Suggested Links */}
        <div className="mt-6 space-x-4">
          <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
            Home
          </Link>
          <Link to="/contact" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
            Contact Support
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

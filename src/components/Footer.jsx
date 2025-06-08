import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaFacebookF,
  FaInstagram,
  FaGlobe,
  FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("US English");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    const langMap = {
      "en-US": "US English",
      "ru-RU": "RU Русский",
      "kk-KZ": "KZ Қазақша",
      "es-ES": "ES Español",
      "fr-FR": "FR Français",
      "de-DE": "DE Deutsch",
    };
    setSelectedLanguage(langMap[userLang] || "US English");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email!");
      return;
    }
    alert("Subscribed successfully!");
    setEmail("");
  };

  return (
    <footer className="bg-white dark:bg-gray-900 shadow-md mt-6 border-t border-gray-200 dark:border-gray-700 relative">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700 dark:text-gray-300">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Reputation Monitor
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The ultimate tool for monitoring and managing online reputation effortlessly.
            </p>
            <button
              onClick={toggleDarkMode}
              className="mt-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h2>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-blue-500 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 transition">Terms of Service</Link></li>
              <li><Link to="/blog" className="hover:text-blue-500 transition">Blog</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subscribe to Updates
            </h2>
            <form onSubmit={handleSubscribe} className="mt-3 flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-l-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Follow Us</h2>
            <div className="mt-3 flex justify-end space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-500 transition"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition"><FaLinkedin size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition"><FaGithub size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-blue-700 transition"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-pink-500 transition"><FaInstagram size={20} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          {/* Address and Email */}
          <div className="text-center md:text-left">
            <p>📍 123 Reputation St, Business City, USA</p>
            <p>📧 support@reputationmonitor.com</p>
          </div>

          {/* Language Selector */}
          <div className="mt-3 md:mt-0 flex items-center space-x-2">
            <FaGlobe className="text-gray-600 dark:text-gray-400" />
            <select
              className="px-4 py-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option>US English</option>
              <option>RU Русский</option>
              <option>KZ Қазақша</option>
              <option>ES Español</option>
              <option>FR Français</option>
              <option>DE Deutsch</option>
            </select>
          </div>

          {/* Copyright */}
          <div className="mt-3 md:mt-0">
            © {new Date().getFullYear()} Reputation Monitor. All rights reserved.
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </footer>
  );
}

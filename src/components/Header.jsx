import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaUserCircle, FaBell, FaSearch } from "react-icons/fa";
import { MdLogout, MdSettings, MdDarkMode, MdLightMode } from "react-icons/md";

export default function Header({ title = "Dashboard", toggleDarkMode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New review on your business!", read: false },
    { id: 2, message: "System update scheduled for tomorrow.", read: true },
  ]);

  const notificationRef = useRef();
  const dropdownRef = useRef();

  // Проверка клика вне областей для закрытия dropdown и уведомлений
  const handleClickOutside = useCallback((e) => {
    if (notificationRef.current && !notificationRef.current.contains(e.target)) {
      setShowNotifications(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }, []);

  // Инициализация и установка слушателя для кликов вне элементов, а также установка языка и аутентификации
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("auth") === "true");

    const browserLang = navigator.language.slice(0, 2).toUpperCase();
    setLanguage(["EN", "RU", "KZ", "ES", "FR", "DE"].includes(browserLang) ? browserLang : "EN");

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Синхронизация класса темы с состоянием isDarkMode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Переключение темы
  const handleToggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
    // Передаем информацию наверх (если нужно)
    toggleDarkMode && toggleDarkMode(newTheme);
  };

  // Выход из аккаунта
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");

  };


  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>

      <div className="relative hidden md:block">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="px-4 py-2 w-64 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-500 dark:text-gray-400" />
      </div>

      <div className="flex items-center space-x-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-2 py-1 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="EN">🇺🇸 EN</option>
          <option value="RU">🇷🇺 RU</option>
          <option value="KZ">🇰🇿 KZ</option>
          <option value="ES">🇪🇸 ES</option>
          <option value="FR">🇫🇷 FR</option>
          <option value="DE">🇩🇪 DE</option>
        </select>

        {isAuthenticated && (
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-800 dark:text-white hover:text-blue-500 relative"
            >
              <FaBell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
                {notifications.length ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`px-4 py-2 text-sm cursor-pointer ${
                        n.read ? "text-gray-500" : "text-gray-900 dark:text-white"
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      {n.message}
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500">No notifications</p>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleToggleDarkMode}
          className="text-gray-800 dark:text-white hover:text-blue-500"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>

        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              <FaUserCircle className="h-6 w-6 text-blue-500" />
              <span className="hidden sm:block">John Doe</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

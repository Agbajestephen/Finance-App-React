import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "theme";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;
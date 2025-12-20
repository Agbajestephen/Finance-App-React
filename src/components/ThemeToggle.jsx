import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "system"
  );

  useEffect(() => {
    const apply = (t) => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
      } else {
        document.documentElement.setAttribute("data-theme", t);
      }
    };
    apply(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="join">
      <button
        className={`btn join-item ${theme === "light" ? "btn-active" : ""}`}
        onClick={() => setTheme("light")}
      >
        Light
      </button>
      <button
        className={`btn join-item ${theme === "dark" ? "btn-active" : ""}`}
        onClick={() => setTheme("dark")}
      >
        Dark
      </button>
      <button
        className={`btn join-item ${theme === "system" ? "btn-active" : ""}`}
        onClick={() => setTheme("system")}
      >
        System
      </button>
    </div>
  );
}
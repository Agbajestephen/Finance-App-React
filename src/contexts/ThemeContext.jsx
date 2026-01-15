import { createContext, useContext, useEffect, useState, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  // Apply theme to <html>
  const applyTheme = (value) => {
    document.documentElement.classList.toggle("dark", value === "dark");
  };

  // Load theme from Firestore
  useEffect(() => {
    // Wait until auth is fully resolved
    if (authLoading) return;

    // User logged out, reset to default
    if (!currentUser) {
      setTheme("light");
      applyTheme("light");
      setLoading(false);
      initialized.current = false;
      return;
    }

    // Prevent duplicate loads
    if (initialized.current) return;
    initialized.current = true;

    const loadTheme = async () => {
      try {
        const ref = doc(
          db,
          "users",
          currentUser.uid,
          "settings",
          "prefs"
        );

        const snap = await getDoc(ref);

        if (snap.exists() && snap.data().theme) {
          setTheme(snap.data().theme);
          applyTheme(snap.data().theme);
        } else {
          applyTheme("light");
        }
      } catch (err) {
        console.error("Failed to load theme:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [currentUser, authLoading]);

  // Toggle theme and save to Firestore
  const toggleTheme = async () => {
    if (!currentUser) return;

    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);

    try {
      const ref = doc(
        db,
        "users",
        currentUser.uid,
        "settings",
        "prefs"
      );

      await setDoc(ref, { theme: newTheme }, { merge: true });
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

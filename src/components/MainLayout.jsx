// MainLayout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from "./ThemeToggle.jsx";



const MainLayout = ({ children }) => {
  const location = useLocation();

  // Hide ThemeToggle on Welcome page
  const hideToggle = location.pathname === "/";

  return (
    <>
      {!hideToggle && <ThemeToggle />}
      {children}
    </>
  );
};

export default MainLayout;
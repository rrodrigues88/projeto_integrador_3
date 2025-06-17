import React from "react";
import "../styles/Header.css";

function Header({ onLoginClick, isLoggedIn, onLogout }) {
  return (
    <header className="header">
      <h1 className="app-title">Pi-III</h1>
      <div className="header-buttons">
        {isLoggedIn ? (
          <button className="header-button" onClick={onLogout}>
            Sair
          </button>
        ) : (
          <button className="header-button" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

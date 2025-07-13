import React, { useState, useEffect } from "react";
import "./styles/App.css";

import Header from "./components/Header";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";

function App() {
  const [screen, setScreen] = useState("home");
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }

    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
      setScreen(storedRole === "admin" ? "admin" : "user");
    }
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setScreen(role === "admin" ? "admin" : "user");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
    setScreen("home");
  };

  return (
    <div className="app">
      <Header
        onLoginClick={() => setScreen("login")}
        isLoggedIn={!!userRole}
        onLogout={handleLogout}
      />

      <main>
        {screen === "home" && (
          <ProductsPage
            onBuyClick={(productId) => {
              if (userRole === "user") {
                alert("Para adicionar ao carrinho, acesse seu painel de usuário.");
              } else if (userRole === "admin") {
                alert("Admin não pode comprar produtos.");
              } else {
                setScreen("login");
              }
            }}
            products={products}
          />
        )}
        {screen === "login" && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setScreen("home")}
          />
        )}
        {screen === "admin" && userRole === "admin" && (
          <AdminPage onLogout={handleLogout} />
        )}
        {screen === "user" && userRole === "user" && (
          <UserPage products={products} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;

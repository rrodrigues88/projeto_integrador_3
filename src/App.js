import React, { useState, useEffect } from "react";
import "./styles/App.css";

import Header from "./components/Header";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [screen, setScreen] = useState("home");
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState([]);

  // Restaura o login e produtos ao carregar o app
  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }

    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
      setScreen(storedRole === "admin" ? "admin" : "home");
    }
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setScreen(role === "admin" ? "admin" : "home");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // limpa localStorage ao sair
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
            onBuyClick={() => {
              if (userRole) {
                alert("Compra simulada! Em breve finalizaremos isso.");
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
      </main>
    </div>
  );
}

export default App;

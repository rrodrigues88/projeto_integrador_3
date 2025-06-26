import React, { useState } from "react";
import "../styles/LoginPage.css";


function LoginPage({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Usuários fake
    const users = {
      "admin@email.com": { password: "a123456", role: "admin" },
      "usuario@email.com": { password: "a123456", role: "user" }
    };

    const user = users[email];

    if (user && user.password === password) {
      onLoginSuccess(user.role);
    } else {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Feira dos Sertões de Crateús</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      <div className="login-links">
        <button className="link-button">Esqueci minha senha</button>
        <button className="link-button">Novo usuário</button>
      </div>
      <button className="back-button" onClick={onBack}>
        Voltar
      </button>
    </div>
  );
}

export default LoginPage;

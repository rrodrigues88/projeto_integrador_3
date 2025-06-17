import React, { useEffect, useState } from "react";
import "../styles/AdminPage.css";

function AdminPage({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    image: "",
    stock: 0
  });
  const [activeMenu, setActiveMenu] = useState("produtos");
  const [imagePreview, setImagePreview] = useState(null);

  // Carrega produtos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  // Atualiza localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit || !form.image) return;

    const newProduct = {
      id: Date.now(),
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0
    };

    setProducts((prev) => [...prev, newProduct]);
    setForm({ name: "", price: "", unit: "", image: "", stock: 0 });
    setImagePreview(null);
  };

  const handleStockChange = (productId, newStock) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, stock: Math.max(0, newStock) }
        : product
    ));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "produtos":
        return (
          <>
            <form className="admin-form" onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Nome do produto"
                value={form.name}
                onChange={handleChange}
              />
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Preço"
                value={form.price}
                onChange={handleChange}
              />
              <input
                name="unit"
                placeholder="Unidade (ex: kg, litro, fardo)"
                value={form.unit}
                onChange={handleChange}
              />
              <input
                name="stock"
                type="number"
                min="0"
                placeholder="Quantidade em estoque"
                value={form.stock}
                onChange={handleChange}
              />
              <div className="image-upload-container">
                <label className="image-upload-label">
                  Escolher Imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
              <button type="submit">Cadastrar Produto</button>
            </form>

            <div className="admin-product-list">
              {products.map(({ id, name, price, unit, image, stock }) => (
                <div key={id} className="admin-product-card">
                  <img src={image} alt={name} />
                  <div>
                    <strong>{name}</strong>
                    <p>R$ {price.toFixed(2).replace(".", ",")} por {unit}</p>
                    <p>Estoque: {stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case "estoque":
        return (
          <div className="estoque-container">
            <h3>Gerenciamento de Estoque</h3>
            <div className="estoque-grid">
              {products.map(({ id, name, image, stock, unit }) => (
                <div key={id} className="estoque-card">
                  <img src={image} alt={name} />
                  <div className="estoque-info">
                    <h4>{name}</h4>
                    <div className="estoque-controls">
                      <button
                        onClick={() => handleStockChange(id, stock - 1)}
                        className="estoque-button"
                      >
                        -
                      </button>
                      <span className="estoque-quantity">{stock} {unit}</span>
                      <button
                        onClick={() => handleStockChange(id, stock + 1)}
                        className="estoque-button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "vendas":
        return (
          <div className="vendas-container">
            <h3>Histórico de Vendas</h3>
            <p>Nenhuma venda registrada.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <nav className="sidebar-menu">
          <button
            className={`menu-item ${activeMenu === "produtos" ? "active" : ""}`}
            onClick={() => setActiveMenu("produtos")}
          >
            Produtos
          </button>
          <button
            className={`menu-item ${activeMenu === "estoque" ? "active" : ""}`}
            onClick={() => setActiveMenu("estoque")}
          >
            Estoque
          </button>
          <button
            className={`menu-item ${activeMenu === "vendas" ? "active" : ""}`}
            onClick={() => setActiveMenu("vendas")}
          >
            Vendas
          </button>
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h2>Painel do Administrador</h2>
        </div>
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;


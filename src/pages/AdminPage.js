import React, { useEffect, useState } from "react";
import "../styles/AdminPage.css";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    image: "",
    stock: 0,
    category: ""
  });
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");
  const [activeMenu, setActiveMenu] = useState("produtos");
  const [activeProductTab, setActiveProductTab] = useState("cadastro");
  const [imagePreview, setImagePreview] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    const storedCategories = localStorage.getItem("categories");
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const trimmed = categoryName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      setCategoryName("");
    }
  };

  const handleCategoryEdit = (index) => {
    setEditingCategoryIndex(index);
    setEditingCategoryValue(categories[index]);
  };

  const handleCategorySave = () => {
    const trimmed = editingCategoryValue.trim();
    if (trimmed && !categories.includes(trimmed)) {
      const updated = [...categories];
      const oldCategory = categories[editingCategoryIndex];
      updated[editingCategoryIndex] = trimmed;

      const updatedProducts = products.map((p) =>
        p.category === oldCategory ? { ...p, category: trimmed } : p
      );

      setCategories(updated);
      setProducts(updatedProducts);
    }
    setEditingCategoryIndex(null);
    setEditingCategoryValue("");
  };

  const handleCategoryDelete = (index) => {
    const catToRemove = categories[index];
    const updatedCategories = categories.filter((_, i) => i !== index);
    const updatedProducts = products.map((p) =>
      p.category === catToRemove ? { ...p, category: "" } : p
    );
    setCategories(updatedCategories);
    setProducts(updatedProducts);
    if (expandedCategory === catToRemove) setExpandedCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit || !form.image || !form.category) return;

    const price = parseFloat(form.price);
    const stock = parseInt(form.stock) || 0;

    if (isNaN(price) || price < 0) {
      alert("O preço não pode ser negativo.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...form,
      price,
      stock
    };

    setProducts((prev) => [...prev, newProduct]);
    setForm({ name: "", price: "", unit: "", image: "", stock: 0, category: "" });
    setImagePreview(null);
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

  const renderProductTabs = () => {
    switch (activeProductTab) {
      case "cadastro":
        return (
          <form className="admin-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Nome do produto" value={form.name} onChange={handleChange} />
            <input name="price" type="number" step="0.01" min="0" placeholder="Preço" value={form.price} onChange={handleChange} />
            <input name="unit" placeholder="Unidade (ex: kg, litro, fardo)" value={form.unit} onChange={handleChange} />
            <input name="stock" type="number" min="0" placeholder="Quantidade em estoque" value={form.stock} onChange={handleChange} />
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Selecione uma categoria</option>
              {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
            <div className="image-upload-container">
              <label className="image-upload-label">
                Escolher Imagem
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              {imagePreview && <div className="image-preview"><img src={imagePreview} alt="Preview" /></div>}
            </div>
            <button type="submit">Cadastrar Produto</button>
          </form>
        );
      case "categorias":
        return (
          <div className="categorias-container">
            <form className="admin-form" onSubmit={handleCategorySubmit}>
              <input placeholder="Nova categoria" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
              <button type="submit">Adicionar Categoria</button>
            </form>

            <div className="categoria-list">
              {categories.map((cat, index) => (
                <div key={index} className="categoria-item">
                  {editingCategoryIndex === index ? (
                    <>
                      <input value={editingCategoryValue} onChange={(e) => setEditingCategoryValue(e.target.value)} />
                      <button onClick={handleCategorySave}>Salvar</button>
                      <button onClick={() => setEditingCategoryIndex(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <span>{cat}</span>
                      <button onClick={() => handleCategoryEdit(index)}>Editar</button>
                      <button onClick={() => handleCategoryDelete(index)}>Excluir</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "produtos":
        return (
          <div>
            <div className="product-tabs">
              <button className={`tab-button ${activeProductTab === "cadastro" ? "active" : ""}`} onClick={() => setActiveProductTab("cadastro")}>Cadastro de Produtos</button>
              <button className={`tab-button ${activeProductTab === "categorias" ? "active" : ""}`} onClick={() => setActiveProductTab("categorias")}>Cadastro de Categorias</button>
            </div>
            {renderProductTabs()}
          </div>
        );
      case "estoque":
        return (
          <div className="estoque-container">
            <h3>Estoque por Categoria</h3>
            <div className="categoria-list vertical">
              {categories.map((cat, i) => (
                <div key={i}>
                  <button
                    className={`categoria-btn ${expandedCategory === cat ? "selected" : ""}`}
                    onClick={() =>
                      setExpandedCategory((prev) => (prev === cat ? null : cat))
                    }
                  >
                    {cat}
                  </button>

                  {expandedCategory === cat && (
                    <div className="estoque-list">
                      {products.filter(p => p.category === cat).map(product => (
                        <div key={product.id} className="estoque-item">
                          <img src={product.image} alt={product.name} className="estoque-thumb" />
                          <div>
                            <p><strong>Categoria:</strong> {product.category}</p>
                            <p><strong>Produto:</strong> {product.name}</p>
                            <p><strong>Qtd:</strong> {product.stock}</p>
                            <p><strong>Preço:</strong> R$ {product.price.toFixed(2).replace('.', ',')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
        <div className="sidebar-header"><h3>Menu</h3></div>
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeMenu === "produtos" ? "active" : ""}`} onClick={() => setActiveMenu("produtos")}>Produtos</button>
          <button className={`menu-item ${activeMenu === "estoque" ? "active" : ""}`} onClick={() => setActiveMenu("estoque")}>Estoque</button>
          <button className={`menu-item ${activeMenu === "vendas" ? "active" : ""}`} onClick={() => setActiveMenu("vendas")}>Vendas</button>
        </nav>
      </div>
      <div className="admin-main">
        <div className="admin-header"><h2>Painel do Administrador</h2></div>
        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default AdminPage;

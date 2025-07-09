import React, { useEffect, useState } from "react";
import "../styles/AdminPage.css";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    image: "",
    stock: 0,
    category: ""
  });
  const [categoryName, setCategoryName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [activeMenu, setActiveMenu] = useState("produtos");
  const [productTab, setProductTab] = useState("cadastro");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [saleForm, setSaleForm] = useState({ productId: "", quantity: 1 });

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    const storedCategories = localStorage.getItem("categories");
    const storedSales = localStorage.getItem("sales");
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedSales) setSales(JSON.parse(storedSales));
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit || !form.image || !form.category) return;

    const price = parseFloat(form.price);
    const stock = parseInt(form.stock) || 0;
    if (isNaN(price) || price < 0) {
      alert("Preço inválido.");
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
    const removed = categories[index];
    const updatedCategories = categories.filter((_, i) => i !== index);
    const updatedProducts = products.map((p) =>
      p.category === removed ? { ...p, category: "" } : p
    );
    setCategories(updatedCategories);
    setProducts(updatedProducts);
    if (expandedCategory === removed) setExpandedCategory(null);
  };

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    const product = products.find((p) => p.id === parseInt(saleForm.productId));
    const quantity = parseInt(saleForm.quantity);
    if (!product || quantity <= 0 || quantity > product.stock) {
      alert("Estoque insuficiente ou entrada inválida.");
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, stock: p.stock - quantity } : p
    );
    setProducts(updatedProducts);

    const newSale = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      category: product.category,
      unit: product.unit,
      quantity,
      price: product.price,
      total: quantity * product.price,
      timestamp: new Date().toISOString()
    };

    setSales((prev) => [...prev, newSale]);
    setSaleForm({ productId: "", quantity: 1 });
  };

  const renderProdutos = () => (
    <>
      <div className="product-tabs">
        <button className={`tab-button ${productTab === "cadastro" ? "active" : ""}`} onClick={() => setProductTab("cadastro")}>Cadastro de Produtos</button>
        <button className={`tab-button ${productTab === "categorias" ? "active" : ""}`} onClick={() => setProductTab("categorias")}>Cadastro de Categorias</button>
      </div>

      {productTab === "cadastro" ? (
        <form className="admin-form" onSubmit={handleSubmitProduct}>
          <input name="name" placeholder="Nome do produto" value={form.name} onChange={handleChange} />
          <input name="price" type="number" step="0.01" placeholder="Preço" value={form.price} onChange={handleChange} />
          <input name="unit" placeholder="Unidade (kg, litro...)" value={form.unit} onChange={handleChange} />
          <input name="stock" type="number" placeholder="Estoque" value={form.stock} onChange={handleChange} />
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Selecione a categoria</option>
            {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
          <label className="image-upload-label">
            Escolher Imagem
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
          {imagePreview && <img src={imagePreview} alt="preview" className="image-preview" />}
          <button type="submit">Cadastrar Produto</button>
        </form>
      ) : (
        <div className="categorias-container">
          <form className="admin-form" onSubmit={handleCategorySubmit}>
            <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nova categoria" />
            <button type="submit">Adicionar</button>
          </form>
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
      )}
    </>
  );

  const renderEstoque = () => (
    <div className="estoque-container">
      <h3>Estoque por Categoria</h3>
      {categories.map((cat, i) => (
        <div key={i}>
          <button
            className={`categoria-btn ${expandedCategory === cat ? "selected" : ""}`}
            onClick={() => setExpandedCategory(prev => prev === cat ? null : cat)}
          >
            {cat}
          </button>
          {expandedCategory === cat && (
            <div className="estoque-list">
              {products.filter(p => p.category === cat).map((p) => (
                <div key={p.id} className="estoque-item">
                  <img src={p.image} alt={p.name} className="estoque-thumb" />
                  <div>
                    <p><strong>Categoria:</strong> {p.category}</p>
                    <p><strong>Produto:</strong> {p.name}</p>
                    <p><strong>Qtd:</strong> {p.stock} {p.unit}</p>
                    <p><strong>Preço:</strong> R$ {p.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderVendas = () => (
    <div className="vendas-container">
      <h3>Registrar Venda</h3>
      <form className="admin-form" onSubmit={handleSaleSubmit}>
        <select name="productId" value={saleForm.productId} onChange={handleSaleChange}>
          <option value="">Selecione o produto</option>
          {products.filter(p => p.stock > 0).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Estoque: {p.stock})
            </option>
          ))}
        </select>
        <input name="quantity" type="number" min="1" value={saleForm.quantity} onChange={handleSaleChange} />
        <button type="submit">Registrar</button>
      </form>

      <h3>Histórico de Vendas</h3>
      {sales.length === 0 ? (
        <p>Nenhuma venda registrada.</p>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Qtd</th>
              <th>Preço Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{new Date(sale.timestamp).toLocaleString()}</td>
                <td>{sale.productName}</td>
                <td>{sale.category}</td>
                <td>{sale.quantity} {sale.unit}</td>
                <td>R$ {sale.price.toFixed(2).replace('.', ',')}</td>
                <td>R$ {sale.total.toFixed(2).replace('.', ',')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "produtos": return renderProdutos();
      case "estoque": return renderEstoque();
      case "vendas": return renderVendas();
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h3>Menu</h3>
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeMenu === "produtos" ? "active" : ""}`} onClick={() => setActiveMenu("produtos")}>Produtos</button>
          <button className={`menu-item ${activeMenu === "estoque" ? "active" : ""}`} onClick={() => setActiveMenu("estoque")}>Estoque</button>
          <button className={`menu-item ${activeMenu === "vendas" ? "active" : ""}`} onClick={() => setActiveMenu("vendas")}>Vendas</button>
        </nav>
      </div>
      <div className="admin-main">
        <h2>Painel do Administrador</h2>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;

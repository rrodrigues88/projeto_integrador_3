import React, { useState, useEffect } from "react";
import "../styles/UserPage.css";

function UserPage({ onLogout, products }) {
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("userCart");
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedPurchases = localStorage.getItem("userPurchases");
    if (storedPurchases) setPurchases(JSON.parse(storedPurchases));
  }, []);

  useEffect(() => {
    localStorage.setItem("userCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("userPurchases", JSON.stringify(purchases));
  }, [purchases]);

  const addToCart = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (item) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { productId, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const finalizePurchase = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    const timestamp = new Date().toISOString();
    const purchaseItems = cart.map(({ productId, quantity }) => {
      const product = products.find((p) => p.id === productId);
      return {
        productId,
        productName: product?.name || "Produto removido",
        quantity,
        price: product?.price || 0,
        total: (product?.price || 0) * quantity,
      };
    });

    const totalPrice = purchaseItems.reduce((acc, item) => acc + item.total, 0);

    const newPurchase = {
      id: Date.now(),
      timestamp,
      items: purchaseItems,
      totalPrice,
    };

    setPurchases((prev) => [newPurchase, ...prev]);
    setCart([]);

    alert("Compra finalizada com sucesso!");
  };

  return (
    <div className="user-container">
      <header className="user-header">
        <h2>Bem-vindo ao seu painel</h2>
        <button className="btn btn-logout" onClick={onLogout}>
          Sair
        </button>
      </header>

      <section className="user-section">
        <h3>Carrinho de Compras</h3>
        {cart.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Preço Unit.</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(({ productId, quantity }) => {
                const product = products.find((p) => p.id === productId);
                if (!product) return null;
                return (
                  <tr key={productId}>
                    <td>{product.name}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          updateQuantity(productId, parseInt(e.target.value, 10))
                        }
                        className="input-qty"
                      />
                    </td>
                    <td>R$ {product.price.toFixed(2).replace(".", ",")}</td>
                    <td>
                      R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeFromCart(productId)}
                        title="Remover do carrinho"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {cart.length > 0 && (
          <button className="btn btn-primary btn-finalize" onClick={finalizePurchase}>
            Finalizar Compra
          </button>
        )}
      </section>

      <section className="user-section">
        <h3>Últimas Compras</h3>
        {purchases.length === 0 ? (
          <p>Você ainda não realizou compras.</p>
        ) : (
          purchases.map((purchase) => (
            <div key={purchase.id} className="purchase-card">
              <div className="purchase-header">
                Compra em: {new Date(purchase.timestamp).toLocaleString()}
              </div>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Preço Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>R$ {item.price.toFixed(2).replace(".", ",")}</td>
                      <td>R$ {item.total.toFixed(2).replace(".", ",")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="purchase-total">
                Total: R$ {purchase.totalPrice.toFixed(2).replace(".", ",")}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default UserPage;

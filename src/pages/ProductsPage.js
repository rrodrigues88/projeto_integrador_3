import React from "react";
import "../styles/ProductsPage.css";

function ProductsPage({ onBuyClick, products }) {
  return (
    <div className="products-container">
      {products.length === 0 && <p>Nenhum produto cadastrado.</p>}
      {products.map(({ id, name, price, image, unit }) => (
        <div key={id} className="product-card">
          <img src={image} alt={name} className="product-image" />
          <h3 className="product-name">{name}</h3>
          <p className="product-price">
            R$ {price.toFixed(2).replace(".", ",")}{" "}
            <span className="product-unit">por {unit}</span>
          </p>
          <button className="buy-button" onClick={() => onBuyClick(id)}>
            Comprar
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;

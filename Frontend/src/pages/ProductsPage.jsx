import { useEffect, useState } from "react";

import request from "../api";
import { useCart } from "../state/CartContext";
import { useWishlist } from "../state/WishlistContext";

const ProductsPage = ({ navigate }) => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const params = new URLSearchParams(window.location.search);
  const searchTerm = (params.get("search") || "").toLowerCase();
  const selectedCategory = params.get("category") || "All";

  useEffect(() => {
    request("/products")
      .then((data) => {
        setProducts(data.products);
        setStatus("ready");
      })
      .catch((requestError) => {
        setError(requestError.message);
        setStatus("error");
      });
  }, []);

  if (status === "loading") return <p>Loading products...</p>;
  if (status === "error") return <p className="error">{error}</p>;

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Collection</p>
        <h2>{selectedCategory === "All" ? "All products" : selectedCategory}</h2>
      </div>
      <div className="catalog-toolbar">
        <div className="filter-row">
          {categories.map((category) => (
            <button
              className={category === selectedCategory ? "filter-pill active" : "filter-pill"}
              key={category}
              onClick={() =>
                navigate(category === "All" ? "/products" : `/products?category=${category}`)
              }
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        <strong>{visibleProducts.length} items</strong>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <article className="product-card" key={product._id}>
            <button
              className={hasItem(product._id) ? "wishlist-button active" : "wishlist-button"}
              onClick={() => toggleItem(product)}
              type="button"
            >
              {hasItem(product._id) ? "Saved" : "Save"}
            </button>
            <button onClick={() => navigate(`/products/${product._id}`)} type="button">
              <img
                alt={product.name}
                src={product.image}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "https://placehold.co/400x400/e8f1ff/101828?text=Image+Unavailable";
                }}
              />
            </button>
            <div className="product-body">
              <span className="pill">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="rating-row">
                <strong>4.5</strong>
                <span>Best seller</span>
              </div>
              <strong>Rs. {product.price}</strong>
              <button onClick={() => addItem(product)} type="button">
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductsPage;

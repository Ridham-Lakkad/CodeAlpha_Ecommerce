import { useCart } from "../state/CartContext";
import { useWishlist } from "../state/WishlistContext";

const WishlistPage = ({ navigate }) => {
  const { addItem } = useCart();
  const { items, toggleItem } = useWishlist();

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h2>Your wishlist is empty</h2>
        <p>Save products here while you compare what to buy.</p>
        <button onClick={() => navigate("/products")} type="button">
          Start shopping
        </button>
      </section>
    );
  }

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Saved for later</p>
        <h2>Wishlist</h2>
      </div>
      <div className="product-grid">
        {items.map((product) => (
          <article className="product-card" key={product._id}>
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
              <strong>Rs. {product.price}</strong>
              <div className="button-row">
                <button onClick={() => addItem(product)} type="button">
                  Add to cart
                </button>
                <button className="secondary" onClick={() => toggleItem(product)} type="button">
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WishlistPage;

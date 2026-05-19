import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";

const CartPage = ({ navigate }) => {
  const { user } = useAuth();
  const { items, removeItem, subtotal, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/products")} type="button">
          Browse products
        </button>
      </section>
    );
  }

  return (
    <section className="cart-layout">
      <div>
        <p className="eyebrow">Your bag</p>
        <h2>Shopping cart</h2>
        {items.map((item) => (
          <article className="cart-item" key={item._id}>
            <img alt={item.name} src={item.image} />
            <div>
              <h3>{item.name}</h3>
              <p>Rs. {item.price}</p>
            </div>
            <input
              max={item.stock}
              min="1"
              onChange={(event) => updateQuantity(item._id, Number(event.target.value))}
              type="number"
              value={item.quantity}
            />
            <button className="secondary" onClick={() => removeItem(item._id)} type="button">
              Remove
            </button>
          </article>
        ))}
      </div>
      <aside className="summary">
        <h3>Order summary</h3>
        <p>Subtotal: Rs. {subtotal}</p>
        <button
          onClick={() => {
            if (!user) {
              sessionStorage.setItem("shopeasy-next-path", "/checkout");
            }
            navigate(user ? "/checkout" : "/auth");
          }}
          type="button"
        >
          {user ? "Checkout" : "Login to checkout"}
        </button>
      </aside>
    </section>
  );
};

export default CartPage;

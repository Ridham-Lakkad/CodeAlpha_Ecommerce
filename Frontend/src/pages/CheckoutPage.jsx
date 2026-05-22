import { useState } from "react";

import request from "../api";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";

const CheckoutPage = ({ navigate }) => {
  const { token, user } = useAuth();
  const { clearCart, items, subtotal } = useCart();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    addressLine: user?.addressLine || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    country: user?.country || "India",
  });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    try {
      await request("/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          shippingAddress: form,
        }),
      });

      await request("/auth/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.fullName,
          addressLine: form.addressLine,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        }),
      });

      clearCart();
      navigate("/orders");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <section className="checkout-layout">
      <form onSubmit={submit}>
        <h2>Checkout</h2>
        {Object.entries(form).map(([field, value]) => (
          <label key={field}>
            {field}
            <input
              onChange={(event) => setForm({ ...form, [field]: event.target.value })}
              required
              value={value}
            />
          </label>
        ))}
        {error && <p className="error">{error}</p>}
        <button type="submit">Place order</button>
      </form>
      <aside className="summary">
        <h3>Total</h3>
        <p>Rs. {subtotal}</p>
      </aside>
    </section>
  );
};

export default CheckoutPage;

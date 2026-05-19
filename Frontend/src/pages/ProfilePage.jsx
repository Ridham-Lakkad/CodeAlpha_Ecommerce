import { useEffect, useMemo, useState } from "react";

import request from "../api";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import { useWishlist } from "../state/WishlistContext";

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AB";

const getMembershipLabel = (orders) => {
  if (orders.length >= 8) return "Platinum customer";
  if (orders.length >= 4) return "Gold customer";
  if (orders.length >= 1) return "Silver customer";
  return "New customer";
};

const formatCustomerId = (id = "") => {
  if (!id) return "APB-C00001";

  const numericId = parseInt(id.slice(-8), 16);
  const customerNumber = Number.isNaN(numericId) ? 1 : (numericId % 100000) + 1;

  return `APB-C${String(customerNumber).padStart(5, "0")}`;
};

const ProfilePage = ({ navigate }) => {
  const { token, user } = useAuth();
  const { itemCount: cartCount, subtotal } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    request("/orders/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => setOrders(data.orders || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  const accountDetails = useMemo(() => {
    const savedLocation = localStorage.getItem("apna-bazaar-location") || "Ahmedabad 382350";
    const latestOrder = orders[0];
    const primaryAddress = latestOrder?.shippingAddress;

    return {
      savedLocation,
      primaryAddress,
      latestOrder,
    };
  }, [orders]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const delivered = orders.filter((order) => order.status === "delivered").length;
    const active = orders.filter((order) => ["pending", "paid", "shipped"].includes(order.status)).length;

    return { totalSpent, delivered, active };
  }, [orders]);

  if (!token) {
    return (
      <section className="empty-state profile-empty">
        <p className="eyebrow">Login required</p>
        <h2>Log in to view your profile</h2>
        <p>Sign in to see your personal details, saved delivery information, and shopping activity.</p>
        <button onClick={() => navigate("/auth")} type="button">Login</button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="profile-page">
        <div className="orders-loading">
          <span />
          <p>Loading your profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <header className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">{getInitials(user?.name)}</div>
        <div className="profile-hero-copy">
          <p className="eyebrow">Customer profile</p>
          <h2>{user?.name || "Apna Bazaar customer"}</h2>
          <p>{getMembershipLabel(orders)} with secure checkout, saved activity, and order support.</p>
        </div>
        <div className="profile-hero-actions">
          <button onClick={() => navigate("/orders")} type="button">View orders</button>
          <button className="secondary" onClick={() => navigate("/products")} type="button">
            Continue shopping
          </button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="profile-stat-grid">
        <article>
          <span>Total spent</span>
          <strong>{formatCurrency(stats.totalSpent)}</strong>
        </article>
        <article>
          <span>Orders placed</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <span>Active orders</span>
          <strong>{stats.active}</strong>
        </article>
        <article>
          <span>Delivered</span>
          <strong>{stats.delivered}</strong>
        </article>
      </div>

      <div className="profile-grid">
        <section className="profile-panel">
          <div className="profile-panel-header">
            <div>
              <p className="eyebrow">Personal information</p>
              <h3>Account details</h3>
            </div>
          </div>
          <dl className="profile-detail-list">
            <div>
              <dt>Full name</dt>
              <dd>{user?.name || "Not added"}</dd>
            </div>
            <div>
              <dt>Email address</dt>
              <dd>{user?.email || "Not added"}</dd>
            </div>
            <div>
              <dt>Account type</dt>
              <dd>{user?.role === "admin" ? "Administrator" : "Customer"}</dd>
            </div>
            <div>
              <dt>Customer ID</dt>
              <dd>{formatCustomerId(user?.id)}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-panel">
          <div className="profile-panel-header">
            <div>
              <p className="eyebrow">Delivery</p>
              <h3>Address book</h3>
            </div>
          </div>
          {accountDetails.primaryAddress ? (
            <div className="profile-address-card">
              <strong>{accountDetails.primaryAddress.fullName}</strong>
              <p>{accountDetails.primaryAddress.addressLine}</p>
              <p>
                {accountDetails.primaryAddress.city}, {accountDetails.primaryAddress.postalCode}
              </p>
              <p>{accountDetails.primaryAddress.country}</p>
            </div>
          ) : (
            <div className="profile-address-card muted-card">
              <strong>No saved shipping address yet</strong>
              <p>Your latest checkout address will appear here after you place an order.</p>
            </div>
          )}
          <div className="profile-location-row">
            <span>Current delivery location</span>
            <strong>{accountDetails.savedLocation}</strong>
          </div>
        </section>

        <section className="profile-panel">
          <div className="profile-panel-header">
            <div>
              <p className="eyebrow">Shopping</p>
              <h3>Quick summary</h3>
            </div>
          </div>
          <div className="profile-quick-list">
            <button onClick={() => navigate("/cart")} type="button">
              <span>Cart items</span>
              <strong>{cartCount}</strong>
            </button>
            <button onClick={() => navigate("/wishlist")} type="button">
              <span>Wishlist items</span>
              <strong>{wishlistCount}</strong>
            </button>
            <button onClick={() => navigate("/checkout")} type="button">
              <span>Cart value</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </button>
          </div>
        </section>

        <section className="profile-panel">
          <div className="profile-panel-header">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h3>Latest order</h3>
            </div>
          </div>
          {accountDetails.latestOrder ? (
            <div className="profile-order-card">
              <div>
                <strong>Order #{accountDetails.latestOrder._id.slice(-6).toUpperCase()}</strong>
                <p>Placed on {formatDate(accountDetails.latestOrder.createdAt)}</p>
              </div>
              <span className={`status-badge status-${accountDetails.latestOrder.status}`}>
                {accountDetails.latestOrder.status}
              </span>
              <p>{accountDetails.latestOrder.items.length} item types</p>
              <strong>{formatCurrency(accountDetails.latestOrder.totalAmount)}</strong>
            </div>
          ) : (
            <div className="profile-address-card muted-card">
              <strong>No orders yet</strong>
              <p>Start shopping and your most recent order will be shown here.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProfilePage;

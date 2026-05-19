import { useEffect, useMemo, useState } from "react";

import request from "../api";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";

const statusSteps = ["pending", "paid", "shipped", "delivered"];
const statusFilters = [...statusSteps, "cancelled"];

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const getDeliveryMessage = (order) => {
  const createdAt = new Date(order.createdAt);
  const deliveryDate = new Date(createdAt);
  deliveryDate.setDate(createdAt.getDate() + 5);

  if (order.status === "cancelled") return "Cancelled by customer";
  if (order.status === "delivered") return `Delivered on ${formatDate(order.updatedAt || order.createdAt)}`;
  if (order.status === "shipped") return `Expected by ${formatDate(deliveryDate)}`;
  if (order.status === "paid") return "Preparing your order for shipment";
  return "Order received and awaiting confirmation";
};

const getItemCount = (order) =>
  order.items.reduce((count, item) => count + Number(item.quantity || 0), 0);

const OrdersPage = ({ navigate }) => {
  const { token } = useAuth();
  const { addItem } = useCart();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState("");
  const [trackingOrderId, setTrackingOrderId] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    Promise.all([
      request("/orders/mine", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      request("/products"),
    ])
      .then(([orderData, productData]) => {
        const nextOrders = orderData.orders || [];
        setOrders(nextOrders);
        setProducts(productData.products || []);
        setExpandedOrderId(nextOrders[0]?._id || "");
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch =
          !query ||
          order._id.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query));

        return matchesStatus && matchesSearch;
      })
      .sort((first, second) => {
        if (sortBy === "oldest") return new Date(first.createdAt) - new Date(second.createdAt);
        if (sortBy === "highest") return second.totalAmount - first.totalAmount;
        if (sortBy === "lowest") return first.totalAmount - second.totalAmount;
        return new Date(second.createdAt) - new Date(first.createdAt);
      });
  }, [orders, search, sortBy, statusFilter]);

  const reorder = (order) => {
    const productMap = new Map(products.map((product) => [product._id, product]));
    let addedCount = 0;

    order.items.forEach((item) => {
      const productId = typeof item.product === "string" ? item.product : item.product?._id;
      const product = productMap.get(productId);

      if (!product) return;

      addItem(product, item.quantity);
      addedCount += item.quantity;
    });

    setNotice(
      addedCount
        ? `${addedCount} item${addedCount > 1 ? "s" : ""} added to cart from order #${order._id.slice(-6)}.`
        : "Those products are not available right now."
    );
  };

  const trackOrder = (order) => {
    setExpandedOrderId(order._id);
    setTrackingOrderId((current) => (current === order._id ? "" : order._id));
    setNotice("");
  };

  const cancelOrder = async (order) => {
    if (order.status !== "pending" || cancellingOrderId) return;

    try {
      setCancellingOrderId(order._id);
      setNotice("");
      const data = await request(`/orders/${order._id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((current) =>
        current.map((item) => (item._id === order._id ? data.order : item))
      );
      setExpandedOrderId(order._id);
      setTrackingOrderId(order._id);
      setNotice(`Order #${order._id.slice(-6).toUpperCase()} has been cancelled.`);
    } catch (requestError) {
      setNotice(requestError.message || "Unable to cancel this order.");
    } finally {
      setCancellingOrderId("");
    }
  };

  if (!token) {
    return (
      <section className="empty-state orders-empty">
        <p className="eyebrow">Login required</p>
        <h2>Log in to view your orders</h2>
        <p>Sign in to track orders, reorder products, and view delivery details.</p>
        <button onClick={() => navigate("/auth")} type="button">Login</button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="orders-page">
        <h2>My orders</h2>
        <div className="orders-loading">
          <span />
          <p>Loading your orders...</p>
        </div>
      </section>
    );
  }

  if (error) return <p className="error">{error}</p>;

  if (orders.length === 0) {
    return (
      <section className="empty-state orders-empty">
        <p className="eyebrow">No orders yet</p>
        <h2>Your order history is empty</h2>
        <p>When you place an order, tracking details and purchased items will appear here.</p>
        <button onClick={() => navigate("/products")} type="button">Continue shopping</button>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-header">
        <div>
          <p className="eyebrow">Order history</p>
          <h2>My orders</h2>
          <p>{orders.length} order{orders.length > 1 ? "s" : ""} placed from your account.</p>
        </div>
        <button onClick={() => navigate("/products")} type="button">Continue shopping</button>
      </div>

      <div className="orders-toolbar">
        <input
          aria-label="Search orders"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by order ID or product"
          value={search}
        />
        <select
          aria-label="Filter by status"
          onChange={(event) => setStatusFilter(event.target.value)}
          value={statusFilter}
        >
          <option value="all">All statuses</option>
          {statusFilters.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          aria-label="Sort orders"
          onChange={(event) => setSortBy(event.target.value)}
          value={sortBy}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
        </select>
      </div>

      {notice && <p className="auth-notice">{notice}</p>}

      {visibleOrders.length === 0 ? (
        <section className="empty-state orders-empty">
          <h2>No matching orders</h2>
          <p>Try another status filter or search term.</p>
        </section>
      ) : (
        <div className="orders-list">
          {visibleOrders.map((order) => {
            const currentStep = statusSteps.indexOf(order.status);
            const isExpanded = expandedOrderId === order._id;
            const isTracking = trackingOrderId === order._id;
            const isCancelled = order.status === "cancelled";

            return (
              <article className="order-card order-history-card" key={order._id}>
                <header className="order-card-header">
                  <div>
                    <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                    <p>Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </header>

                <div className="order-summary-grid">
                  <div>
                    <span>Total</span>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                  <div>
                    <span>Items</span>
                    <strong>{getItemCount(order)}</strong>
                  </div>
                  <div>
                    <span>Delivery</span>
                    <strong>{getDeliveryMessage(order)}</strong>
                  </div>
                </div>

                {isCancelled ? (
                  <div className="cancelled-panel">
                    <strong>Order cancelled</strong>
                    <span>Stock was restored and this order will not be shipped.</span>
                  </div>
                ) : (
                  <div className="order-progress" aria-label={`Order status: ${order.status}`}>
                    {statusSteps.map((status, index) => (
                      <span
                        className={index <= currentStep ? "complete" : ""}
                        key={status}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                )}

                {isExpanded && (
                  <div className="order-details">
                    <div className="order-items">
                      {order.items.map((item) => (
                        <div className="order-item" key={`${order._id}-${item.product}`}>
                          <img alt={item.name} src={item.image} />
                          <div>
                            <strong>{item.name}</strong>
                            <p>Qty {item.quantity} x {formatCurrency(item.price)}</p>
                          </div>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <aside className="shipping-card">
                      <h3>Shipping address</h3>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.addressLine}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </aside>
                  </div>
                )}

                {isTracking && (
                  <section className="tracking-panel">
                    <div>
                      <p className="eyebrow">Tracking update</p>
                      <h3>{getDeliveryMessage(order)}</h3>
                      <p>
                        Last updated on {formatDate(order.updatedAt || order.createdAt)}.
                      </p>
                    </div>
                    <ol>
                      {statusSteps.map((status, index) => (
                        <li
                          className={index <= currentStep && !isCancelled ? "complete" : ""}
                          key={status}
                        >
                          <strong>{status}</strong>
                          <span>
                            {index <= currentStep && !isCancelled
                              ? "Completed"
                              : "Waiting for update"}
                          </span>
                        </li>
                      ))}
                      {isCancelled && (
                        <li className="cancelled complete">
                          <strong>cancelled</strong>
                          <span>Cancelled by customer</span>
                        </li>
                      )}
                    </ol>
                  </section>
                )}

                <footer className="order-actions">
                  <button
                    className="secondary"
                    onClick={() => setExpandedOrderId(isExpanded ? "" : order._id)}
                    type="button"
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>
                  <button
                    className="secondary"
                    onClick={() => trackOrder(order)}
                    type="button"
                  >
                    {isTracking ? "Hide tracking" : "Track order"}
                  </button>
                  <button onClick={() => reorder(order)} type="button">Reorder</button>
                  <button
                    className="secondary"
                    disabled={order.status !== "pending" || cancellingOrderId === order._id}
                    onClick={() => cancelOrder(order)}
                    type="button"
                  >
                    {cancellingOrderId === order._id ? "Cancelling..." : "Cancel order"}
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;

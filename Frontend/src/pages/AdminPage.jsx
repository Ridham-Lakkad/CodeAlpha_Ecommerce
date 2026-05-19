import { useEffect, useState } from "react";

import request from "../api";
import { useAuth } from "../state/AuthContext";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
};

const AdminPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const authHeaders = { Authorization: `Bearer ${token}` };

  const loadData = async () => {
    const [dashboardData, orderData, productData] = await Promise.all([
      request("/admin/dashboard", { headers: authHeaders }),
      request("/admin/orders", { headers: authHeaders }),
      request("/products"),
    ]);
    setStats(dashboardData.stats);
    setOrders(orderData.orders);
    setProducts(productData.products);
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveProduct = async (event) => {
    event.preventDefault();
    const method = editingProductId ? "PUT" : "POST";
    const path = editingProductId
      ? `/admin/products/${editingProductId}`
      : "/admin/products";

    await request(path, {
      method,
      headers: authHeaders,
      body: JSON.stringify({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      }),
    });
    setProduct(emptyProduct);
    setEditingProductId(null);
    loadData();
  };

  const editProduct = (nextProduct) => {
    setEditingProductId(nextProduct._id);
    setProduct({
      name: nextProduct.name,
      description: nextProduct.description,
      price: nextProduct.price,
      image: nextProduct.image,
      category: nextProduct.category,
      stock: nextProduct.stock,
    });
  };

  const deleteProduct = async (productId) => {
    await request(`/admin/products/${productId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    loadData();
  };

  const updateStatus = async (orderId, status) => {
    await request(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ status }),
    });
    loadData();
  };

  return (
    <section className="admin-grid">
      <div>
        <h2>Admin dashboard</h2>
        {stats && (
          <div className="stat-grid">
            <strong>Users {stats.users}</strong>
            <strong>Products {stats.products}</strong>
            <strong>Orders {stats.orders}</strong>
            <strong>Revenue Rs. {stats.revenue}</strong>
          </div>
        )}
        <form onSubmit={saveProduct}>
          <h3>{editingProductId ? "Edit product" : "Add product"}</h3>
          {Object.entries(product).map(([field, value]) => (
            <label key={field}>
              {field}
              <input
                onChange={(event) => setProduct({ ...product, [field]: event.target.value })}
                required
                value={value}
              />
            </label>
          ))}
          <button type="submit">
            {editingProductId ? "Update product" : "Create product"}
          </button>
        </form>
        <h2>Products</h2>
        <div className="stack">
          {products.map((item) => (
            <article className="order-card" key={item._id}>
              <div>
                <strong>{item.name}</strong>
                <p>Rs. {item.price} | Stock {item.stock}</p>
              </div>
              <div className="button-row">
                <button onClick={() => editProduct(item)} type="button">
                  Edit
                </button>
                <button className="secondary" onClick={() => deleteProduct(item._id)} type="button">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div>
        <h2>Orders</h2>
        <div className="stack">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div>
                <strong>{order.user?.name || "Unknown user"}</strong>
                <p>Rs. {order.totalAmount}</p>
              </div>
              <select
                onChange={(event) => updateStatus(order._id, event.target.value)}
                value={order.status}
              >
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;

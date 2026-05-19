import { useEffect, useMemo, useState } from "react";

import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import WishlistPage from "./pages/WishlistPage";
import { AuthProvider, useAuth } from "./state/AuthContext";
import { CartProvider } from "./state/CartContext";
import { WishlistProvider } from "./state/WishlistContext";

const getLocation = () => new URL(window.location.href);

const RouteView = () => {
  const [location, setLocation] = useState(getLocation());
  const { user } = useAuth();

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setLocation(getLocation());
  };

  useEffect(() => {
    const handlePopState = () => setLocation(getLocation());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const pathname = location.pathname;
  const search = location.search;

  const page = useMemo(() => {
    if (pathname === "/") return <HomePage navigate={navigate} />;
    if (pathname === "/products") return <ProductsPage navigate={navigate} />;
    if (pathname.startsWith("/products/")) {
      return <ProductPage productId={pathname.split("/")[2]} navigate={navigate} />;
    }
    if (pathname === "/cart") return <CartPage navigate={navigate} />;
    if (pathname === "/wishlist") return <WishlistPage navigate={navigate} />;
    if (pathname === "/auth") return <AuthPage navigate={navigate} />;
    if (pathname === "/profile") return user ? <ProfilePage navigate={navigate} /> : <AuthPage navigate={navigate} />;
    if (pathname === "/checkout") {
      if (!user) {
        sessionStorage.setItem("shopeasy-next-path", "/checkout");
      }
      return user ? <CheckoutPage navigate={navigate} /> : <AuthPage navigate={navigate} />;
    }
    if (pathname === "/orders") return <OrdersPage navigate={navigate} />;
    if (pathname === "/admin" && user?.role === "admin") return <AdminPage />;
    return <HomePage navigate={navigate} />;
  }, [pathname, search, user]);

  return (
    <Layout navigate={navigate}>
      {page}
    </Layout>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <RouteView />
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;

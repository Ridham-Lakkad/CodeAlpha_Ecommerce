import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import { useWishlist } from "../state/WishlistContext";

const NavButton = ({ children, onClick }) => (
  <button className="nav-button" onClick={onClick} type="button">
    {children}
  </button>
);

const Layout = ({ children, navigate }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const locationOptions = [
    "Ahmedabad 382350",
    "Mumbai 400001",
    "Delhi 110001",
    "Bengaluru 560001",
    "Chennai 600001",
  ];

  const categoryOptions = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Home",
    "Accessories",
    "Fitness",
    "Beauty",
    "Furniture",
    "Travel",
  ];

  const getSelectedCategoryFromUrl = () => {
    const category = new URLSearchParams(window.location.search).get("category");
    return category === "All" || !category ? "All Categories" : category;
  };

  const [selectedCategory, setSelectedCategory] = useState(getSelectedCategoryFromUrl());

  const pinCodeToLocation = {
    "382350": "Ahmedabad 382350",
    "382330": "Ahmedabad 382330",
    "360311": "Gondal 360311",
    "400001": "Mumbai 400001",
    "400002": "Mumbai 400002",
    "110001": "Delhi 110001",
    "110002": "Delhi 110002",
    "560001": "Bengaluru 560001",
    "560002": "Bengaluru 560002",
    "600001": "Chennai 600001",
    "600002": "Chennai 600002",
    "700001": "Kolkata 700001",
    "500001": "Hyderabad 500001",
  };

  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem("apna-bazaar-location") || "Ahmedabad 382350";
  });
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("apna-bazaar-location", selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    const currentCategory = getSelectedCategoryFromUrl();
    if (currentCategory !== selectedCategory) {
      setSelectedCategory(currentCategory);
    }
  });

  const navigateToCategory = (nextCategory) => {
    setSelectedCategory(nextCategory);
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search") || "";
    const categoryValue = nextCategory === "All Categories" ? "" : nextCategory;
    const nextParams = new URLSearchParams();

    if (searchQuery) nextParams.set("search", searchQuery);
    if (categoryValue) nextParams.set("category", categoryValue);

    navigate(`/products${nextParams.toString() ? `?${nextParams.toString()}` : ""}`);
  };

  const handleApplyPinCode = async () => {
    const sanitized = pinCode.trim();
    if (!/^[0-9]{6}$/.test(sanitized)) {
      setPinError("Please enter a valid 6-digit pincode.");
      return;
    }

    setPinError("");
    setPinLoading(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${sanitized}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0 || data[0].Status !== "Success") {
        setSelectedLocation(`Pincode ${sanitized}`);
      } else {
        const postOffice = data[0].PostOffice?.[0];
        if (postOffice) {
          setSelectedLocation(`${postOffice.Name} ${sanitized}`);
        } else {
          setSelectedLocation(`Pincode ${sanitized}`);
        }
      }

      setLocationModalOpen(false);
      setPinCode("");
    } catch (error) {
      setPinError("Unable to verify pincode right now. Please try again.");
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="promo-bar">
          <span>Free delivery above Rs. 999</span>
          <span>7-day easy returns</span>
          <span>Secure payments</span>
        </div>
        <div className="header-top">
          <button className="brand" onClick={() => navigate("/")} type="button">
            <span className="brand-mark">A</span>
            <span>Apna Bazaar</span>
          </button>
          <button
            className="location-panel location-button"
            type="button"
            onClick={() => setLocationModalOpen(true)}
          >
            <span className="location-marker" aria-hidden="true">📍</span>
            <div>
              <span className="location-title">Delivering to</span>
              <span className="location-value">{selectedLocation}</span>
            </div>
          </button>
          {locationModalOpen && (
            <div className="location-modal-overlay" onClick={() => setLocationModalOpen(false)}>
              <div className="location-modal" onClick={(event) => event.stopPropagation()}>
                <div className="location-modal-header">
                  <h2>Choose your location</h2>
                  <button
                    className="location-modal-close"
                    type="button"
                    onClick={() => setLocationModalOpen(false)}
                    aria-label="Close location modal"
                  >
                    ×
                  </button>
                </div>
                <p className="location-modal-copy">
                  Select a delivery location to see product availability and delivery options
                </p>
                <button
                  type="button"
                  className="location-modal-cta"
                  onClick={() => {
                    setLocationModalOpen(false);
                    navigate("/auth");
                  }}
                >
                  Sign in to see your addresses
                </button>
                <div className="location-modal-divider">or enter an Indian pincode</div>
                <div className="location-modal-input-row">
                  <input
                    className="location-modal-input"
                    placeholder="Enter pincode"
                    value={pinCode}
                    onChange={(event) => {
                      setPinCode(event.target.value.replace(/[^0-9]/g, ""));
                      setPinError("");
                    }}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    className="location-modal-apply"
                    onClick={handleApplyPinCode}
                    disabled={pinLoading}
                  >
                    {pinLoading ? "Checking..." : "Apply"}
                  </button>
                </div>
                {pinError && <p className="location-modal-error">{pinError}</p>}
                <div className="location-option-list">
                  {locationOptions.map((location) => (
                    <button
                      key={location}
                      type="button"
                      className="location-option-button"
                      onClick={() => {
                        setSelectedLocation(location);
                        setLocationModalOpen(false);
                      }}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <form
            className="search-bar"
            onSubmit={(event) => {
              event.preventDefault();
              const query = new FormData(event.currentTarget).get("query");
              const category = selectedCategory === "All Categories" ? "" : selectedCategory;
              const categoryParam = category ? `&category=${encodeURIComponent(category)}` : "";
              navigate(`/products?search=${encodeURIComponent(query)}${categoryParam}`);
            }}
          >
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(event) => navigateToCategory(event.target.value)}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input name="query" placeholder="Search for products, brands and more" />
            <button type="submit">Search</button>
          </form>
          <nav className="quick-actions">
            <NavButton onClick={() => navigate("/wishlist")}>
              Wishlist ({wishlistCount})
            </NavButton>
            <NavButton onClick={() => navigate("/cart")}>Cart ({itemCount})</NavButton>
          </nav>
        </div>
        <div className="header-bottom">
          <nav className="account-nav">
            <NavButton onClick={() => navigate("/")}>Discover</NavButton>
            <NavButton onClick={() => navigate("/products")}>Products</NavButton>
            {user ? (
              <>
                <NavButton onClick={() => navigate("/profile")}>Profile</NavButton>
                <NavButton onClick={() => navigate("/orders")}>Orders</NavButton>
                {user.role === "admin" && (
                  <NavButton onClick={() => navigate("/admin")}>Admin</NavButton>
                )}
                <NavButton
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </NavButton>
              </>
            ) : (
              <NavButton onClick={() => navigate("/auth")}>Login</NavButton>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-card">
            <h3>Apna Bazaar</h3>
            <p>
              Shop the best deals across electronics, fashion, home, accessories and fitness.
              Fast delivery, secure checkout and support for every order.
            </p>
          </div>
          <div className="footer-card">
            <h3>Shop</h3>
            <button type="button" className="footer-link" onClick={() => navigate("/products")}>All Products</button>
            <button type="button" className="footer-link" onClick={() => navigate("/products?category=Electronics")}>Electronics</button>
            <button type="button" className="footer-link" onClick={() => navigate("/products?category=Fashion")}>Fashion</button>
            <button type="button" className="footer-link" onClick={() => navigate("/products?category=Home")}>Home</button>
          </div>
          <div className="footer-card">
            <h3>Customer Service</h3>
            <button type="button" className="footer-link">Help Center</button>
            <button type="button" className="footer-link">Returns</button>
            <button type="button" className="footer-link">Delivery Info</button>
            <button type="button" className="footer-link">Contact Us</button>
          </div>
          <div className="footer-card">
            <h3>Follow Us</h3>
            <div className="social-row">
              <a href="#" className="social-pill" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.5 2C4.46243 2 2 4.46243 2 7.5V16.5C2 19.5376 4.46243 22 7.5 22H16.5C19.5376 22 22 19.5376 22 16.5V7.5C22 4.46243 19.5376 2 16.5 2H7.5ZM12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5ZM18.5 6.25C18.0858 6.25 17.75 6.58579 17.75 7C17.75 7.41421 18.0858 7.75 18.5 7.75C18.9142 7.75 19.25 7.41421 19.25 7C19.25 6.58579 18.9142 6.25 18.5 6.25ZM12 9.25C10.7559 9.25 9.75 10.2559 9.75 11.5C9.75 12.7441 10.7559 13.75 12 13.75C13.2441 13.75 14.25 12.7441 14.25 11.5C14.25 10.2559 13.2441 9.25 12 9.25Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-pill" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13 2H16V6H13V10H17L16.5 14H13V22H9V14H6V10H9V7C9 4.79086 10.7909 3 13 3H16V2Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-pill" aria-label="Twitter">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 5.8C21.18 6.14 20.31 6.34 19.4 6.4C20.33 5.86 21.03 5 21.33 3.97C20.46 4.46 19.5 4.8 18.49 4.98C17.66 4.11 16.42 3.6 15.06 3.6C12.42 3.6 10.31 5.71 10.31 8.35C10.31 8.69 10.35 9.02 10.44 9.33C7.08 9.17 4.12 7.56 2.12 4.95C1.71 5.63 1.46 6.41 1.46 7.24C1.46 8.84 2.32 10.25 3.66 11.04C2.94 11.02 2.28 10.82 1.69 10.48V10.54C1.69 12.82 3.31 14.76 5.47 15.18C5.08 15.28 4.67 15.33 4.25 15.33C3.95 15.33 3.66 15.31 3.38 15.25C3.96 17.16 5.7 18.55 7.79 18.59C6.18 19.88 4.18 20.64 1.99 20.64C1.61 20.64 1.24 20.62 0.87 20.58C3 21.95 5.45 22.76 8.05 22.76C15.05 22.76 19.52 16.67 19.52 10.38C19.52 10.2 19.52 10.03 19.51 9.85C20.38 9.26 21.13 8.51 21.7 7.63C20.9 7.98 20.04 8.21 19.14 8.31C20.05 7.81 20.75 7.01 21.09 6.06L22 5.8Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-pill" aria-label="Website">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C15.31 4 18 6.69 18 10H14.24L15.79 11.55C15.94 11.21 16 10.84 16 10.46C16 8.73 14.59 7.32 12.86 7.32C11.4 7.32 10.2 8.22 9.74 9.44L9 11.1L7.41 11.76C7.47 11.51 7.57 11.26 7.71 11.02C8.53 9.38 10.15 8.32 12 8.32C13.07 8.32 14.05 8.76 14.79 9.49C15.52 10.22 15.97 11.2 15.97 12.27C15.97 12.53 15.94 12.78 15.88 13.02L14.6 13.74H18C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13H8.5C8.5 14.93 10.07 16.5 12 16.5C13.93 16.5 15.5 14.93 15.5 13C15.5 11.07 13.93 9.5 12 9.5C11.52 9.5 11.06 9.6 10.65 9.77L12 7.43V4Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
            <p className="footer-note">Subscribe for offers, new arrivals and exclusive deals.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Apna Bazaar. All rights reserved.</span>
          <span>Made for simple, modern shopping.</span>
        </div>
      </footer>
    </>
  );
};

export default Layout;

const categories = ["Electronics", "Fashion", "Home", "Accessories", "Fitness", "Beauty"];

const HomePage = ({ navigate }) => (
  <>
    <section className="market-hero">
      <div className="hero-copy-block">
        <p className="eyebrow">Mega savings week</p>
        <h1>Deals for every ghar</h1>
        <p className="hero-copy">
          Shop electronics, fashion, home essentials, and everyday picks with quick
          delivery and secure checkout.
        </p>
        <div className="hero-actions">
          <button onClick={() => navigate("/products")} type="button">
            Shop all deals
          </button>
          <button className="secondary hero-secondary" onClick={() => navigate("/products?category=Electronics")} type="button">
            Explore electronics
          </button>
        </div>
      </div>
      <div className="deal-card">
        <span>Today only</span>
        <strong>Up to 40% off</strong>
        <p>On home, fashion, and accessories</p>
      </div>
    </section>
    <section className="category-strip">
      {categories.map((category) => (
        <button
          className="category-tile"
          key={category}
          onClick={() => navigate(`/products?category=${category}`)}
          type="button"
        >
          {category}
        </button>
      ))}
    </section>
    <section className="promo-grid">
      <button
        className="promo-card fashion-card"
        onClick={() => navigate("/products?category=Fashion")}
        type="button"
      >
        <span>Trending now</span>
        <strong>Fresh fashion picks</strong>
      </button>
      <button
        className="promo-card tech-card"
        onClick={() => navigate("/products?category=Electronics")}
        type="button"
      >
        <span>Upgrade zone</span>
        <strong>Smart gadgets</strong>
      </button>
      <button
        className="promo-card home-card"
        onClick={() => navigate("/products?category=Home")}
        type="button"
      >
        <span>New arrivals</span>
        <strong>Home refresh</strong>
      </button>
    </section>
    <section className="feature-strip">
      <div>
        <strong>Free delivery</strong>
        <span>On orders above Rs. 999</span>
      </div>
      <div>
        <strong>Easy returns</strong>
        <span>7-day replacement support</span>
      </div>
      <div>
        <strong>Secure pay</strong>
        <span>Trusted checkout experience</span>
      </div>
    </section>
  </>
);

export default HomePage;

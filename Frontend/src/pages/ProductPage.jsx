import { useEffect, useState } from "react";

import request from "../api";
import { useCart } from "../state/CartContext";
import { useWishlist } from "../state/WishlistContext";

const formatDeliveryDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const ProductPage = ({ productId, navigate }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();

  useEffect(() => {
    let mounted = true;

    request(`/products/${productId}`)
      .then((data) => {
        if (!mounted) return;
        const nextProduct = data.product;
        setProduct(nextProduct);
        setSelectedImage(
          nextProduct.colors?.[0]?.gallery?.[0] || nextProduct.gallery?.[0] || nextProduct.image
        );
        setSelectedColor(nextProduct.colors?.[0] || null);
        setSelectedSize(nextProduct.sizes?.[0] || "");

        const saved = localStorage.getItem(`reviews-${nextProduct._id}`);
        setReviews(saved ? JSON.parse(saved) : []);
      })
      .catch((requestError) => setError(requestError.message));

    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    request("/products").then((data) => {
      const nextSimilar = (data.products || [])
        .filter((item) => item._id !== productId && item.category === product.category)
        .slice(0, 6);
      setSimilar(nextSimilar);
    });
  }, [product, productId]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Loading product...</p>;

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const colorGallery = selectedColor?.gallery?.length ? selectedColor.gallery : [];
  const activeGallery = colorGallery.length ? colorGallery : gallery;
  const avgRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "New";
  const specifications = Object.entries(product.specifications || {});
  const selectedColorLabel = selectedColor?.name || "";
  const deliveryLocation =
    localStorage.getItem("apna-bazaar-location") || "your selected location";

  const handleAddReview = (author, rating, text) => {
    const nextReviews = [{ author, rating, text, date: new Date().toISOString() }, ...reviews];
    setReviews(nextReviews);
    localStorage.setItem(`reviews-${product._id}`, JSON.stringify(nextReviews));
  };

  return (
    <>
      <section className="product-detail">
        <div className="gallery">
          <div className="thumbs">
            {activeGallery.map((src) => (
              <button
                className={`thumb ${src === selectedImage ? "active" : ""}`}
                key={src}
                onClick={() => setSelectedImage(src)}
                type="button"
              >
                <img
                  alt={product.name}
                  src={src}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "https://placehold.co/400x400/e8f1ff/101828?text=Image+Unavailable";
                  }}
                />
              </button>
            ))}
          </div>
          <div className="hero">
            <img
              alt={product.name}
              src={selectedImage}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "https://placehold.co/400x400/e8f1ff/101828?text=Image+Unavailable";
              }}
            />
          </div>
        </div>

        <div className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
          <p className="product-brand">Brand: {product.brand}</p>
          <div className="rating-row detail-rating">
            <strong>{avgRating}</strong>
            <span>{reviews.length} ratings</span>
          </div>
          <p className="detail-copy">{product.description}</p>

          <div className="detail-meta">
            <strong>Rs. {product.price}</strong>
            <span>{product.stock} in stock</span>
          </div>

          {(product.colors?.length > 0 || product.sizes?.length > 0) && (
            <div className="variants">
              {product.colors?.length > 0 && (
                <div className="variant-row">
                  <label>Color: {selectedColorLabel}</label>
                  <div className="color-row">
                    {product.colors.map((color) => (
                      <button
                        className={`color-swatch ${
                          selectedColor?.name === color.name ? "selected" : ""
                        }`}
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImage(color.gallery?.[0] || product.gallery?.[0] || product.image);
                        }}
                        style={{ "--swatch-color": color.hex }}
                        title={color.name}
                        type="button"
                      >
                        <span className="sr-only">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.sizes?.length > 0 && (
                <div className="variant-row">
                  <label>Size</label>
                  <div className="size-row">
                    {product.sizes.map((size) => (
                      <button
                        className={`size-pill ${selectedSize === size ? "selected" : ""}`}
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        type="button"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="button-row">
            <button
              onClick={() => addItem({ ...product, selectedColor, selectedSize })}
              type="button"
            >
              Add to cart
            </button>
            <button className="secondary" onClick={() => toggleItem(product)} type="button">
              {hasItem(product._id) ? "Saved" : "Add to wishlist"}
            </button>
            <button className="secondary" onClick={() => navigate("/products")} type="button">
              Back
            </button>
          </div>
        </div>

        <aside className="purchase-panel">
          <strong className="purchase-price">Rs. {product.price}</strong>
          <p>
            FREE delivery <strong>{formatDeliveryDate(product.deliveryDays)}</strong>
          </p>
          <p className="delivery-location">Deliver to {deliveryLocation}</p>
          <span className="stock-label">{product.stock > 0 ? "In stock" : "Out of stock"}</span>
          <div className="policy-list">
            <div>
              <strong>Returns</strong>
              <span>{product.returnPolicy}</span>
            </div>
            <div>
              <strong>Payment</strong>
              <span>Secure transaction</span>
            </div>
            <div>
              <strong>Dispatch</strong>
              <span>Ships in 24 hours</span>
            </div>
          </div>
          <button
            onClick={() => addItem({ ...product, selectedColor, selectedSize })}
            type="button"
          >
            Add to cart
          </button>
        </aside>
      </section>

      <section className="product-details-grid">
        <div className="detail-panel">
          <h3>Product details</h3>
          <dl>
            {specifications.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="detail-panel">
          <h3>About this item</h3>
          <ul>
            {product.highlights?.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="reviews detail-panel">
        <h3>Ratings & Reviews</h3>
        <p className="small">{reviews.length} review(s)</p>
        <div className="review-list">
          {reviews.length === 0 && <p>No reviews yet. Be the first to review.</p>}
          {reviews.map((review, index) => (
            <div className="review" key={`${review.author}-${index}`}>
              <div className="review-head">
                <strong>{review.author}</strong>
                <span className="rating">{review.rating} star</span>
              </div>
              <p>{review.text}</p>
              <small className="muted">{new Date(review.date).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <AddReview onAdd={handleAddReview} />
      </section>

      <section className="similar detail-panel">
        <h3>Similar products</h3>
        <div className="similar-row">
          {similar.map((item) => (
            <div className="similar-card" key={item._id}>
              <img alt={item.name} src={item.image} />
              <div className="card-body">
                <strong>{item.name}</strong>
                <span>Rs. {item.price}</span>
                <div className="card-actions">
                  <button onClick={() => navigate(`/products/${item._id}`)} type="button">
                    View
                  </button>
                  <button onClick={() => addItem(item)} type="button">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const AddReview = ({ onAdd }) => {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  return (
    <form
      className="add-review"
      onSubmit={(event) => {
        event.preventDefault();
        if (!author || !text) return;
        onAdd(author, Number(rating), text);
        setAuthor("");
        setRating(5);
        setText("");
      }}
    >
      <input
        onChange={(event) => setAuthor(event.target.value)}
        placeholder="Your name"
        value={author}
      />
      <select onChange={(event) => setRating(event.target.value)} value={rating}>
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value} star
          </option>
        ))}
      </select>
      <textarea
        onChange={(event) => setText(event.target.value)}
        placeholder="Share your experience"
        value={text}
      />
      <button type="submit">Submit review</button>
    </form>
  );
};

export default ProductPage;

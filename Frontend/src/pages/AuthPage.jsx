import { useEffect, useMemo, useRef, useState } from "react";

import request from "../api";
import { useAuth } from "../state/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  remember: true,
  terms: false,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordScore = (password) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
};

const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

const getFieldErrors = (form, mode) => {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();

  if (mode === "register") {
    if (!name) {
      errors.name = "Please enter your full name.";
    } else if (name.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Please enter your password.";
  } else if (mode === "register" && form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (mode === "login" && form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (mode === "register") {
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!form.terms) {
      errors.terms = "Please accept the terms to create an account.";
    }
  }

  return errors;
};

const AuthPage = ({ navigate }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const firstInputRef = useRef(null);
  const { login } = useAuth();

  const fieldErrors = useMemo(() => getFieldErrors(form, mode), [form, mode]);
  const isValid = Object.keys(fieldErrors).length === 0;
  const passwordScore = getPasswordScore(form.password);
  const passwordStrength = strengthLabels[passwordScore];

  useEffect(() => {
    firstInputRef.current?.focus();
  }, [mode]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setForm(initialForm);
    setTouched({});
    setError("");
    setNotice("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!isValid) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        terms: true,
      });
      setError("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      const payload =
        mode === "login"
          ? { email: form.email.trim(), password: form.password }
          : {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
            };
      const data = await request(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      login(data, form.remember);
      const nextPath = sessionStorage.getItem("shopeasy-next-path") || "/products";
      sessionStorage.removeItem("shopeasy-next-path");
      navigate(nextPath);
    } catch (requestError) {
      if (mode === "register" && requestError.message === "User already exists") {
        setMode("login");
        setForm({ ...initialForm, email: form.email.trim() });
        setTouched({});
        setError("Account already exists. Please log in.");
      } else {
        setError(requestError.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const showFieldError = (field) => touched[field] && fieldErrors[field];

  return (
    <section className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <div className="auth-visual-content">
          <p className="eyebrow">ShopEasy account</p>
          <h2>Faster checkout, saved orders, and a smoother shopping flow.</h2>
          <div className="auth-benefits">
            <span>Secure email login</span>
            <span>Wishlist and cart access</span>
            <span>Order history ready</span>
          </div>
        </div>
      </div>

      <section className="auth-panel">
        <p className="eyebrow">Account required</p>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="auth-copy">
          {mode === "login"
            ? "Log in to continue shopping, checkout, and manage your orders."
            : "Create an account to checkout faster and save your shopping activity."}
        </p>

        <div className="tabs" role="tablist" aria-label="Authentication mode">
          <button
            aria-selected={mode === "login"}
            className={mode === "login" ? "active" : ""}
            onClick={() => changeMode("login")}
            role="tab"
            type="button"
          >
            Login
          </button>
          <button
            aria-selected={mode === "register"}
            className={mode === "register" ? "active" : ""}
            onClick={() => changeMode("register")}
            role="tab"
            type="button"
          >
            Register
          </button>
        </div>

        <button
          className="social-auth-button"
          onClick={() => setNotice("Google login UI is ready, but backend Google auth is not connected yet.")}
          type="button"
        >
          Continue with Google
        </button>

        <div className="auth-divider"><span>or use email</span></div>

        <form className="auth-form" noValidate onSubmit={submit}>
          {mode === "register" && (
            <label>
              <span>Full name</span>
              <input
                aria-invalid={Boolean(showFieldError("name"))}
                autoComplete="name"
                onBlur={() => markTouched("name")}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Enter your name"
                ref={firstInputRef}
                value={form.name}
              />
              {showFieldError("name") && <span className="field-error">{fieldErrors.name}</span>}
            </label>
          )}

          <label>
            <span>Email address</span>
            <input
              aria-invalid={Boolean(showFieldError("email"))}
              autoComplete="email"
              onBlur={() => markTouched("email")}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              ref={mode === "login" ? firstInputRef : null}
              type="email"
              value={form.email}
            />
            {showFieldError("email") && <span className="field-error">{fieldErrors.email}</span>}
          </label>

          <label>
            <span>Password</span>
            <span className="password-field">
              <input
                aria-invalid={Boolean(showFieldError("password"))}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                onBlur={() => markTouched("password")}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder={mode === "login" ? "Enter your password" : "Create a strong password"}
                type={showPassword ? "text" : "password"}
                value={form.password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
            {mode === "register" && (
              <span className={`password-strength strength-${passwordScore}`}>
                <span><span style={{ width: `${passwordScore * 25}%` }} /></span>
                {passwordStrength}
              </span>
            )}
            {showFieldError("password") && <span className="field-error">{fieldErrors.password}</span>}
          </label>

          {mode === "register" && (
            <label>
              <span>Confirm password</span>
              <span className="password-field">
                <input
                  aria-invalid={Boolean(showFieldError("confirmPassword"))}
                  autoComplete="new-password"
                  onBlur={() => markTouched("confirmPassword")}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  placeholder="Re-enter your password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                />
                <button
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  type="button"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </span>
              {showFieldError("confirmPassword") && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </label>
          )}

          <div className="auth-options">
            <label className="check-row">
              <input
                checked={form.remember}
                onChange={(event) => updateField("remember", event.target.checked)}
                type="checkbox"
              />
              <span>Remember me</span>
            </label>

            {mode === "login" && (
              <button
                className="link-button"
                onClick={() => setNotice("Password reset is not connected yet. Please contact support or admin.")}
                type="button"
              >
                Forgot password?
              </button>
            )}
          </div>

          {mode === "register" && (
            <label className="check-row terms-row">
              <input
                aria-invalid={Boolean(showFieldError("terms"))}
                checked={form.terms}
                onBlur={() => markTouched("terms")}
                onChange={(event) => updateField("terms", event.target.checked)}
                type="checkbox"
              />
              <span>I agree to the terms and privacy policy.</span>
            </label>
          )}

          {showFieldError("terms") && <span className="field-error">{fieldErrors.terms}</span>}
          {notice && <p className="auth-notice">{notice}</p>}
          {error && <p className="error">{error}</p>}

          <button disabled={loading || !isValid} type="submit">
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === "login" ? (
            <>
              New customer?{" "}
              <button className="link-button" onClick={() => changeMode("register")} type="button">
                Register now
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="link-button" onClick={() => changeMode("login")} type="button">
                Login here
              </button>
            </>
          )}
        </p>
      </section>
    </section>
  );
};

export default AuthPage;

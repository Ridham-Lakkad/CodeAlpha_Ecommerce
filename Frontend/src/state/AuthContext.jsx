import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    const raw =
      localStorage.getItem("shopeasy-auth") || sessionStorage.getItem("shopeasy-auth");
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch {
    localStorage.removeItem("shopeasy-auth");
    sessionStorage.removeItem("shopeasy-auth");
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  const value = useMemo(
    () => ({
      ...auth,
      login: (payload, remember = true) => {
        const nextAuth = { user: payload.user, token: payload.token };
        const storage = remember ? localStorage : sessionStorage;
        localStorage.removeItem("shopeasy-auth");
        sessionStorage.removeItem("shopeasy-auth");
        storage.setItem("shopeasy-auth", JSON.stringify(nextAuth));
        setAuth(nextAuth);
      },
      logout: () => {
        localStorage.removeItem("shopeasy-auth");
        sessionStorage.removeItem("shopeasy-auth");
        setAuth({ user: null, token: null });
      },
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

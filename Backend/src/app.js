const cors = require("cors");
const express = require("express");

const apiRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

const frontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (frontendUrl && origin === frontendUrl) {
    return true;
  }

  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }

    return hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true
}));
app.use(express.json());

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

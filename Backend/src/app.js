const cors = require("cors");
const express = require("express");

const apiRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

app.use(cors({
  origin: "https://code-alpha-ecommerce-3atoq1i97-ridhams-projects-456f5490.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

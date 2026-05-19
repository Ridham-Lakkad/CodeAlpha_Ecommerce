const mongoose = require("mongoose");

const getHealthStatus = (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    message: "API is running",
    database: databaseConnected ? "connected" : "disconnected",
  });
};

module.exports = {
  getHealthStatus,
};

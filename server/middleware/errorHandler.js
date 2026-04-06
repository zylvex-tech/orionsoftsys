exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: errors.join(", "), code: "VALIDATION_ERROR" });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} already exists`, code: "DUPLICATE_ENTRY" });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format", code: "INVALID_ID" });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token", code: "INVALID_TOKEN" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
  }

  // Default
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
    code: err.code || "INTERNAL_ERROR"
  });
};

exports.notFound = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}`, code: "NOT_FOUND" });
};

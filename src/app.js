require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const xssSanitize = require("./middlewares/xss");

const { apiLimiter } = require("./middlewares/rateLimitMiddleware");
app.use(express.json());
app.use(cookies());
// protect from xss
app.use(xssSanitize);
// Enhanced security headers specifically for auth
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        /* styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], */
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        /* connectSrc: ["'self'", "https://api.yourdomain.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"], */
        frameAncestors: ["'none'"], // Prevent clickjacking
        formAction: ["'self'"], // Restrict form submissions
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// CORS
app.use(
  cors({
    origin: ["http://localhost:5167"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // accept cookies and Authorization header
  })
);
// Rate Limiter
app.use(apiLimiter);
//routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/products", require("./routes/productRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewRoutes"));
app.use("/api/v1/cart", require("./routes/cartRoutes"));
app.use("/api/v1/orders", require("./routes/orderRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// Error Middleware
app.use(require("./middlewares/errorMiddleware"));

// Not Found
app.use(require("./middlewares/notFoundMiddleware"));
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then((res) => {
    console.log("Connected to database done");
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error:", err.message);
  });

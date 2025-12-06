require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");

// Models
const Movie = require("./models/Movie");
const User = require("./models/User");

// FIXED Mongo URI (must match your .env)
const CONNECTION_STRING = process.env.MONGO_URI;

// View Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware (FIXED)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// For PUT/DELETE
app.use(methodOverride("_method"));

// Pass user to all views
app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/movies", require("./routes/movies"));
app.use("/auth", require("./routes/auth"));

// Start Server after DB Connection
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(CONNECTION_STRING);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();

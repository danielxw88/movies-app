const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/User");
const { validateRegister, validateLogin } = require("../utils/validation");

router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "Register",
    errors: {},
    formData: {},
  });
});

router.post("/register", async (req, res) => {
  const { isValid, errors } = validateRegister(req.body);

  if (!isValid) {
    return res.render("auth/register", {
      title: "Register",
      errors,
      formData: req.body,
    });
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.render("auth/register", {
        title: "Register",
        errors: { email: "This email is already registered." },
        formData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    req.session.user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    res.redirect("/movies");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login",
    errors: {},
    formData: {},
  });
});

router.post("/login", async (req, res) => {
  const { isValid, errors } = validateLogin(req.body);

  if (!isValid) {
    return res.render("auth/login", {
      title: "Login",
      errors,
      formData: req.body,
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        errors: { general: "Invalid email or password." },
        formData: req.body,
      });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.render("auth/login", {
        title: "Login",
        errors: { general: "Invalid email or password." },
        formData: req.body,
      });
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.redirect("/movies");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/logout", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
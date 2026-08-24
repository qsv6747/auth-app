import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signToken(user) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone number is required." });
    }
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const existing = db
      .prepare("SELECT id FROM users WHERE email = ? OR phone = ?")
      .get(email || null, phone || null);
    if (existing) {
      return res.status(409).json({ error: "An account with that email/phone already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const info = db
      .prepare("INSERT INTO users (email, phone, password_hash) VALUES (?, ?, ?)")
      .run(email || null, phone || null, passwordHash);

    const user = { id: info.lastInsertRowid, email, phone };
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, email, phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({ error: "Missing credentials." });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ? OR phone = ?")
      .get(email || null, phone || null);

    // Generic error avoids leaking whether the account exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, phone: user.phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// GET /api/auth/me — example protected route
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db
      .prepare("SELECT id, email, phone, created_at FROM users WHERE id = ?")
      .get(payload.sub);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

export default router;

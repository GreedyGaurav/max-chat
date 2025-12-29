import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub!,
        email: payload.email!,
        name: payload.name,
        avatar: payload.picture,
      });
    }

    const jwtToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken });
  } catch {
    res.status(401).json({ message: "Authentication failed" });
  }
});

export default router;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { readCredentials } from "../utils/jsonFileHandler";
import { Router } from "express";
import { Credentials } from "../utils/types";
import { credentialsSchema } from "../utils/credentialsSchema";
import { authMiddleware } from "../middleware/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const router = Router();

router.post("/login", async (req, res) => {
  const { error: zodError } = credentialsSchema.safeParse(req.body);
  if (zodError) {
    console.log("Validation error", zodError);
    return res.status(400).json({ message: zodError.message });
  }

  const { email, password } = req.body as Credentials;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      console.log("Authentication failed:", error?.message);
      console.log("data", data);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: data.user.email }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.status(200).json({ message: "Authentication successful" });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/isAuthenticated", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Autenticación exitosa" });
});

export default router;

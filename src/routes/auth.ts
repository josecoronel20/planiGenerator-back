import jwt from "jsonwebtoken";
import { Router } from "express";
import {
  credentialsLoginSchema,
  credentialsRegisterSchema,
} from "../utils/credentialsSchema";
import { Credentials, CredentialsRegister } from "../utils/types";
import { readCredentials, writeCredentials } from "../utils/jsonFileHandler";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req, res) => {
  const { error: zodError } = credentialsRegisterSchema.safeParse(req.body);
  if (zodError) {
    console.log("Register request", req.body, zodError);
    console.log("Validation error", zodError);
    return res.status(400).json({ message: zodError.message });
  }
  const { email, password, username } = req.body as CredentialsRegister;

  try {
    const users = await readCredentials();

    if (users.some((user) => user.email === email)) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      username,
      planification:null
    };

    users.push(newUser);

    await writeCredentials(users);

    return res
      .status(201)
      .json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.log("Error al registrar usuario", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { error: zodError } = credentialsLoginSchema.safeParse(req.body);
  if (zodError) {
    console.log("Validation error", zodError);
    return res.status(400).json({ message: zodError.message });
  }

  const { email, password } = req.body as Credentials;

  try {
    const users = await readCredentials();

    const userFinded = users.find((user) => user.email === email);

    if (!userFinded) {
      console.log("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, userFinded.password);

    if (!isPasswordValid) {
      console.log("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: userFinded.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  console.log("Logout successful");
  res.status(200).json({ message: "Logout successful" });
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("Unauthorized: No token");
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

  if (!decoded) {
    console.log("Unauthorized: No decoded");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const users = await readCredentials();

  const user = users.find((user) => user.id === decoded.id);

  if (!user) {
    console.log("Unauthorized: No user");
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({ user: user });
});

export default router;

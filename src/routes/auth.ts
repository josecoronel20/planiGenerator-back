import jwt from "jsonwebtoken";
import { Router } from "express";
import {
  credentialsLoginSchema,
  credentialsRegisterSchema,
} from "../utils/credentialsSchema";
import { Credentials, CredentialsRegister, User } from "../utils/types";
import { readCredentials, writeCredentials } from "../utils/credentialHandler";
import bcrypt from "bcrypt";
import {PrismaClient} from '../generated/prisma'

const router = Router();
const prisma = new PrismaClient();

//register
router.post("/register", async (req, res) => {
  const { error: zodError } = credentialsRegisterSchema.safeParse(req.body);
  if (zodError) {
    console.log("Register request", req.body, zodError);
    console.log("Validation error", zodError);
    return res.status(400).json({ message: zodError.message });
  }
  const { email, password, username } = req.body as CredentialsRegister;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        
      }
    });

    return res
      .status(201)
      .json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.log("Error al registrar usuario", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
});

//login
router.post("/login", async (req, res) => {
  const { error: zodError } = credentialsLoginSchema.safeParse(req.body);
  if (zodError) {
    console.log("Validation error", zodError);
    return res.status(400).json({ message: zodError.message });
  }

  const { email, password } = req.body as Credentials;

  try {
    const users = await prisma.user.findMany();

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



export default router;

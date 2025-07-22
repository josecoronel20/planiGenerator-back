import jwt from "jsonwebtoken";
import { Router } from "express";
import {
  credentialsLoginSchema,
  credentialsRegisterSchema,
} from "../utils/credentialsSchema";
import { Credentials, CredentialsRegister, User } from "../utils/types";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';


const router = Router();
const prisma = new PrismaClient();

//register
router.post("/register", async (req, res) => {
  const { error: zodError } = credentialsRegisterSchema.safeParse(req.body);
  if (zodError) {
    console.log("Register request", req.body, zodError);
    console.log("Validation error", zodError);
    return res.status(400).json({ message: zodError.errors[0].message });
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
      .json({ message: "Usuario creado correctamente" });
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
    return res.status(400).json({ message: zodError.errors[0].message });
  }

  const { email, password } = req.body as Credentials;

  try {
    const users = await prisma.user.findMany();

    const userFinded = users.find((user: any) => user.email === email);

    if (!userFinded) {
      return res.status(401).json({ message: "email o contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, userFinded.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "email o contraseña incorrectos" });
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
    

    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Cierre de sesión exitoso" });
});

export default router;

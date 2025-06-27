import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readCredentials } from "../utils/jsonFileHandler";
import { Router } from "express";
import { Credentials } from "../utils/types";
import { credentialsSchema } from "../utils/credentialsSchema";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/login", async (req, res) => {
  // primera validacion de datos con el schema de zod
  const { error } = credentialsSchema.safeParse(req.body);
  if (error) {
    console.log("Error en la validación de datos", error);
    return res.status(400).json({ message: error.message });
  }

  //extrae los datos del body
  const { username, password } = req.body as Credentials;

  try {
    // lee las credenciales del archivo json
    const credentials = await readCredentials();

    // compara el username con el username de las credenciales
    if (username !== credentials.username) {
      console.log("Usuario incorrecto");
      return res.status(401).json({ message: "Usuario incorrecto" });
    }

    // compara la password con la password de las credenciales
    const isPasswordValid = await bcrypt.compare(
      password,
      credentials.password
    );
    if (!isPasswordValid) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // genera un token jwt
    const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    console.log("Token generado", token);
    // establece el token en una cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 dias
      sameSite: "lax",
    }).status(200).json({ message: "Autenticación exitosa" });


  } catch (error) {
    console.log("Error en la autenticación", error);
    res.status(500).json({ message: "Error en la autenticación" });
  }
});

router.get("/isAuthenticated", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Autenticación exitosa" });
});

export default router;

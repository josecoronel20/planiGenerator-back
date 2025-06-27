import express from "express";
import players from "./routes/players";
import admin from "./routes/admin";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

// Middleware para parsear el body
app.use(express.json());

// Middleware para parsear las cookies
app.use(cookieParser());

// Rutas
// Rutas de players
app.use("/players", players);

// Rutas de admin
app.use("/admin", admin);


app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});

import express from "express";
import auth from "./routes/auth";
import workoutGenerator from "./routes/workoutGenerator";
import user from "./routes/user";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
// Configuración de CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true,
  })
);

// Middleware para parsear el body
app.use(express.json());

// Middleware para parsear las cookies
app.use(cookieParser());

// Rutas
// Rutas de auth
app.use("/auth", auth);
// Rutas de workoutGenerator
app.use("/workoutGenerator", workoutGenerator);
// Rutas de user
app.use("/user", user);
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

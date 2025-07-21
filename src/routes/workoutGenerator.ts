import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { Workout } from "../utils/types";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  //decodificar el token
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    const { id } = decoded;

    if (!id) {
      return res.status(401).json(null);
    }

    //buscar el usuario
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(401).json(null);
    }

    //generar la planificación
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "Eres un generador de rutinas de hipertrofia. Cada ejercicio es un objeto con: exercise, sets, weight.No incluyas repeticiones ni días fijos. Adaptá según nivel (b: básico, i: intermedio, a: avanzado). Usá ejercicios generales (barra, mancuernas, polea, peso corporal); evitá máquinas específicas.Priorizá ejercicios con base científica para hipertrofia. Evitá ejercicios populares pero ineficientes (ej: usá press inclinado mancuernas en vez de banca plana).la estimulación de musculos debe ser equilibrada inclinandose ligeramente por el musculo elegido como prioridad.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const workoutGenerated = JSON.parse(
      response.choices[0].message.content as string
    ) as Workout;

    //delete previous workout
    await prisma.day.deleteMany({ where: { userId: id } });

    //create new workout
    for (let i = 0; i < workoutGenerated.length; i++) {
      const day = workoutGenerated[i];
      await prisma.day.create({
        data: {
          dayIndex: i,
          userId: id,
          exercises: {
            create: day.map((ex: any, index: number) => ({
              
              exercise: ex.exercise,
              sets: ex.sets,
              weight: ex.weight,
              order: index,
            })),
          },
        },
      });
    }

    return res.status(200).json(workoutGenerated);
  } catch (error) {
    console.error("Error al generar el plani", error);
    return res
      .status(500)
      .json({ message: "Error al generar la planificación" });
  }
});

export default router;

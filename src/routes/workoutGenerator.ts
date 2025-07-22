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
          content: `Eres un generador de rutinas de hipertrofia. Cada día debe contener entre 5 y 6 ejercicios, cada uno representado como un objeto con: exercise, sets, weight. No incluyas repeticiones fijas ni días con nombre. Todas las series comienzan con 8 repeticiones. Adaptá la dificultad según el nivel (b: básico, i: intermedio, a: avanzado).

Usá solo ejercicios generales (barra, mancuernas, poleas, peso corporal). Evitá máquinas específicas.

Priorizá ejercicios con respaldo científico para hipertrofia, con foco en tensión mecánica controlada. Evitá ejercicios populares pero ineficientes (ej: reemplazá banca plana por press inclinado con mancuernas).

Educá con tu selección: la sobrecarga progresiva no siempre requiere más peso. También se progresa con más control, mejor ejecución, o más volumen. Permití que se repitan ejercicios o cargas si se mejora la calidad de la ejecución.

Distribuí la estimulación muscular de forma equilibrada, inclinándola ligeramente hacia el grupo elegido como prioridad.

          `,
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

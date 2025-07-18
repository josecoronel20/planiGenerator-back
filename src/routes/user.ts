import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../utils/types";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const router = Router();

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("Unauthorized: No token");
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: number;
  };

  if (!decoded) {
    console.log("Unauthorized: No decoded");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    include: {
      planning: {
        include: {
          exercises: {
            orderBy: {
              order: "asc"
            }
          }
        }
      }
    },    
  });

  if (!user) {
    console.log("Unauthorized: No user");
    return res.status(401).json(null);
  }

  res.status(200).json(user);
});

router.post("/createPlanning", async (req, res) => {
    const { id, planning } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ message: "User not found" });


      //delete previous planning
      await prisma.day.deleteMany({ where: { userId: id } });

      //create new planning
      for (let i = 0; i < planning.length; i++) {
        const day = planning[i];
        await prisma.day.create({
          data: {
            dayIndex: i,
            userId: id,
            exercises: {
              create: day.map((ex: any,index:number) => ({
                id: ex.id,
                exercise: ex.exercise,
                sets: ex.sets,
                weight: ex.weight,
                order:index,
              })),
            },
          },
        });
      }

      return res.status(200).json({ message: "Planning updated" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating planning" });
    }
  });


  router.put("/updateExercise", async (req, res) => {
    const { exercise } = req.body;

    await prisma.exercise.update({ where: { id: exercise.id }, data: {
        sets: exercise.sets,
        weight: exercise.weight,
      } });
    res.status(200).json({ message: "Exercise updated" });
  });
export default router;

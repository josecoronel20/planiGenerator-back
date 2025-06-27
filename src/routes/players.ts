import { Router, Request, Response } from "express";
import { readCredentials } from "../utils/jsonFileHandler";
import { authMiddleware } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

// Get all players
router.get("/", async (req: Request, res: Response) => {
  try {
    const players = await prisma.player.findMany();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: "Error al leer los jugadores" });
  }
});

// Get a player by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const player = await prisma.player.findUnique({
      where: {
        id: id,
      },
      include: {
        stats: true,
        skills: true,
      },
    });

    if (!player) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: "Error al leer el jugador" });
  }
});

// Create a player
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const player = req.body;

    // Chequea que el player no exista
    const { fullName, birthDate } = player;

    const playerExists = await prisma.player.findFirst({
      where: {
        AND: [
          {
            fullName: {
              contains: fullName,
              mode: "insensitive",
            },
          },
          {
            birthDate: new Date(birthDate),
          },
        ],
      },
    });

    if (playerExists) {
      return res.status(400).json({ message: "El jugador ya existe" });
    }

    //desestructuracion de stats y skills para tratarlos aparte
    const { stats, skills, ...playerData } = player;

    const newPlayer = await prisma.player.create({
      data: {
        ...playerData,

        stats: {
          create: {
            ...stats,
          },
        },

        skills: {
          create: {
            ...skills,
          },
        },
      },
    });

    return res.status(201).json({ message: "Jugador creado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el jugador" });
  }
});

// Update a player
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const player = req.body;

    //desestructuracion de stats y skills para tratarlos aparte
    const { stats, skills, ...playerData } = player;

    const updatedPlayer = await prisma.player.update({
      where: { id: id },
      data: {
        ...playerData,

        stats: {
          update: {
            ...stats,
          },
        },

        skills: {
          update: {
            ...skills,
          },
        },
      },
    });

    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el jugador" });
    console.log(error);
  }
});

// Delete a player
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.player.delete({
      where: { id: id },
    });
    res.status(200).json({ message: "Jugador eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el jugador" });
  }
});

export default router;

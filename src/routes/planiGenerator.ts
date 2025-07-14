import { Router } from "express";
import { readCredentials, writeCredentials } from "../utils/credentialHandler";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const { id } = decoded;

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const users = await readCredentials();

    const user = users.find(
      (user) => user.id === id
    );

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userWithPlani = {
        ...user,
        plani: prompt,
    };

    const updatedUsers = users.map((user) =>
        user.id === id ? userWithPlani : user
    );

    await writeCredentials(updatedUsers);

    return res.status(200).json({ message: "Planificación generada correctamente", data: userWithPlani.plani });

  } catch (error) {
    console.error("Error al generar el plani", error);
    return res
      .status(500)
      .json({ message: "Error al generar la planificación" });
  }
});

export default router;

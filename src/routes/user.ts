import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../utils/types";
import { readUser, writeUser } from "../utils/userHandler";

const router = Router();

router.get("/me", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      console.log("Unauthorized: No token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
  
    if (!decoded) {
      console.log("Unauthorized: No decoded");
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const users = await readUser();
  
    const user = users.find((user:User) => user.id === decoded.id);
  
    if (!user) {
      console.log("Unauthorized: No user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(user);
  });

  router.put("/update", async (req, res) => {
    const { id, planification } = req.body;
    const users = await readUser();
    const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.planification = planification;
    await writeUser(users);
    res.status(200).json({ message: "Planification updated" });
  });

  export default router;    
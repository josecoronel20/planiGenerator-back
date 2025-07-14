import { promises as fs } from "fs";
import path from "path";
import { User } from "./types";

const credentialsPath = path.join(__dirname, "../data/auth.json");


// Read credentials
export async function readUser(): Promise<User[]> {
  try {
    const data = await fs.readFile(
      credentialsPath,
      "utf-8"
    );

    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
      return [] as User[];
  }
}

export async function writeUser(user: User[]) {
  try {
    await fs.writeFile(credentialsPath, JSON.stringify(user, null, 2));
  } catch (error) {
    console.error("Error al escribir en el archivo:", error);
  }
  
}

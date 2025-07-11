import { promises as fs } from "fs";
import path from "path";
import { Credentials } from "./types";

const credentialsPath = path.join(__dirname, "../data/auth.json");


// Read credentials
export async function readCredentials(): Promise<Credentials[]> {
  try {
    const data = await fs.readFile(
      credentialsPath,
      "utf-8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo:", error);
      return [] as Credentials[];
  }
}

export async function writeCredentials(credentials: Credentials[]) {
  try {
    await fs.writeFile(credentialsPath, JSON.stringify(credentials, null, 2));
  } catch (error) {
    console.error("Error al escribir en el archivo:", error);
  }
  
}

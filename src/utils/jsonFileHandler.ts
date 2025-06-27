import { promises as fs } from "fs";
import path from "path";
import { Credentials } from "./credentialsSchema";

const credentialsPath = path.join(__dirname, "../data/auth.json");


// Read credentials
export async function readCredentials(): Promise<Credentials> {
  try {
    const data = await fs.readFile(
      credentialsPath,
      "utf-8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return { username: "", password: "" } as Credentials;
  }
}
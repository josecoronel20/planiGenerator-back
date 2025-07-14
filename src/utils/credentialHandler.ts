import { promises as fs } from "fs";
import path from "path";
import { Credentials, User } from "./types";

const credentialsPath = path.join(__dirname, "../data/auth.json");


// Read credentials
export async function readCredentials(): Promise<User[]> {
  try {
    const data = await fs.readFile(
      credentialsPath,
      "utf-8"
    );

    const parsedData = JSON.parse(data);
    const credentials = parsedData.map((user: User) => ({
      id: user.id,
      email: user.email,
      password: user.password,
    }));
    return credentials;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
      return [] as User[];
  }
}

export async function writeCredentials(credentials: Credentials[]) {
  try {
    await fs.writeFile(credentialsPath, JSON.stringify(credentials, null, 2));
  } catch (error) {
    console.error("Error al escribir en el archivo:", error);
  }
  
}

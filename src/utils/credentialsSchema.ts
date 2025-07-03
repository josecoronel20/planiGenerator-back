import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "El email no es válido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }).max(20, { message: "La contraseña no puede tener más de 20 caracteres" }),
});


export type Credentials = z.infer<typeof credentialsSchema>;


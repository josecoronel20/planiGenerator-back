import { z } from "zod";

export const credentialsSchema = z.object({
  username: z.string().min(1, { message: "El usuario es requerido" }).max(20, { message: "El usuario no puede tener más de 20 caracteres" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }).max(20, { message: "La contraseña no puede tener más de 20 caracteres" }),
});


export type Credentials = z.infer<typeof credentialsSchema>;


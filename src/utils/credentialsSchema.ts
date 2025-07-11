import { z } from "zod";

const credentialsLoginSchema = z.object({
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "El email no es válido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }).max(20, { message: "La contraseña no puede tener más de 20 caracteres" }),
});

const credentialsRegisterSchema = z.object({
  username: z.string().min(1, { message: "El nombre de usuario es requerido" }).max(20, { message: "El nombre de usuario no puede tener más de 20 caracteres" }),
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "El email no es válido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }).max(20, { message: "La contraseña no puede tener más de 20 caracteres" }),
});

export { credentialsLoginSchema, credentialsRegisterSchema };
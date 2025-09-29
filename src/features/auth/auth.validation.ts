import z from "zod";

export const emailSchema = z.string()
  .email()

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password is too long");


export const emailPasswordSchema = z.object({
    email : z.string().email(),
    password : z.string().min(8,"Password must be at least 8 characters long")
})
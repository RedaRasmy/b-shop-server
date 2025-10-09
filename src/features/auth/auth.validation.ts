import z from "zod";

export const EmailSchema = z.email()

export const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password is too long");


export const EmailPasswordSchema = z.object({
    email : EmailSchema,
    password : PasswordSchema
})
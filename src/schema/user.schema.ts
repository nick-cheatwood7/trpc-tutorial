import { z } from "zod";

export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
    firstName: z.string(),
    lastName: z.string()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3)
});

export const defaultUserResponse = z.object({
    message: z.string(),
    error: z.boolean()
});

export const loginResponse = z.object({
    message: z.string(),
    accessToken: z.string()
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type LoginInput = z.TypeOf<typeof loginSchema>;

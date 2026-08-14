import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Please provide a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 8 characters long")
        .max(100, "Password cannot exceed 100 characters"),

    role: z.enum(["jobseeker", "recruiter"], {
        error: "Role must be either jobseeker or recruiter",
    }),
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password cannot exceed 100 characters"),
});
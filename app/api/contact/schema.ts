import { z } from "zod";

export const CONTACT_INTENTS = [
  "full-time",
  "consulting",
  "advisory",
  "collaboration",
  "general",
] as const;

export type ContactIntent = (typeof CONTACT_INTENTS)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),
  intent: z.enum(CONTACT_INTENTS, {
    error: "Please select a valid inquiry intent",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(3000, "Message cannot exceed 3,000 characters"),
  website: z.string().max(0, "Bot detected").optional().or(z.literal("")),
  loadedAt: z.number().optional(),
});

export type ContactSubmission = z.infer<typeof contactSchema>;

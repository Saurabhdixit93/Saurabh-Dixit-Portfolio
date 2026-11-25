import { z } from 'zod';

/**
 * Zod validation schema for incoming assistant queries.
 * Validates 1 <= message <= 500 chars, history <= 10 messages.
 */
export const AssistantRequestSchema = z.object({
  message: z
    .string({ error: 'Message is required' })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message cannot exceed 500 characters'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1, 'History message cannot be empty').max(1000, 'History message too long'),
      })
    )
    .max(10, 'History cannot exceed 10 messages')
    .optional()
    .default([]),
});

export type AssistantRequest = z.infer<typeof AssistantRequestSchema>;

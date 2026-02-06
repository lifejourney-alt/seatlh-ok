import { z } from "zod";

// Regex for Nirma Roll No: 2 Digits + 3 Letters + 3 Digits (e.g., 21BCE045)
// We allow some flexibility, but this is the standard format.
const ROLL_NO_REGEX = /^[0-9]{2}[a-zA-Z]{3}[0-9]{3}$/;

export const RollNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(ROLL_NO_REGEX, { message: "Invalid Roll Number format (e.g., 21BCE045)" });

export const SubmitCrushSchema = z.object({
  // The array must have exactly 5 entries, but they can be empty strings
  crushes: z.array(
    z.string().transform((val) => val.trim().toUpperCase())
  ).max(5),
  
  isOpenToAll: z.boolean().default(false),
});

// Type inference for usage in frontend forms
export type SubmitCrushInput = z.infer<typeof SubmitCrushSchema>;
import {z} from "zod";

/**
 * Shared password policy: at least 8 characters, with an uppercase letter, a
 * lowercase letter and a special symbol.
 * The backend re-checks the same policy in config/plugins.ts.
 */

export const PASSWORD_HINT =
    "At least 8 characters, including an uppercase letter, a lowercase letter and a special symbol.";


export const passwordSchema = z
  .string()
  .min(8, PASSWORD_HINT)
  .regex(/[A-Z]/, PASSWORD_HINT)
  .regex(/[a-z]/, PASSWORD_HINT)
  .regex(/[^A-Za-z0-9]/, PASSWORD_HINT);



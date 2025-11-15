import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.email("Invalid email"),
  phones: z
    .array(
      z.object({
        phone: z.string().min(1, "Phone is required"),
      })
    )
    .min(1, "At least one phone is required")
    .max(2, "Only 2 phones are allowed"),

  hotel: z.string().optional(),
  reservation_number: z.string().optional(),
  room_number: z.string().optional(),
  medic_note: z.string().optional(),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;

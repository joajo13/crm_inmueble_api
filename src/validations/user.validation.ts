import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(3),
  phone: z.string().optional(),
  roleIds: z.array(z.number()).optional()
});

export const updateUserRolesSchema = z.object({
  roleIds: z.array(z.number())
}); 
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Невірний формат email' }),
  password: z.string().min(8, { error: 'Пароль має містити мінімум 8 символів' }),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(2, { error: 'Ім’я має містити мінімум 2 символи' }),
    email: z.email({ error: 'Невірний формат email' }),
    // Порожній телефон — це '', а не undefined, тому спершу перетворюємо
    phone: z.preprocess(
      (v) => (v === '' ? undefined : v),
      z
        .string()
        .regex(/^\+380\d{9}$/, { error: 'Формат телефону: +380XXXXXXXXX' })
        .optional()
    ),
    password: z.string().min(8, { error: 'Пароль має містити мінімум 8 символів' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Паролі не збігаються',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormData = z.output<typeof registerSchema>;

import { z } from 'zod';

export const carSchema = z.object({
  brand: z.string().min(2, { error: 'Вкажіть марку' }),
  model: z.string().min(1, { error: 'Вкажіть модель' }),
  plate_number: z
    .string()
    .trim()
    .min(4, { error: 'Номер занадто короткий' })
    .max(12, { error: 'Номер занадто довгий' })
    .transform((v) => v.toUpperCase().replace(/\s+/g, '')),
});

export type CarFormInput = z.input<typeof carSchema>;
export type CarFormData = z.output<typeof carSchema>;

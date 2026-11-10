import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(2, { error: 'Назва має містити мінімум 2 символи' }),
  description: z.preprocess((v) => (v === '' ? undefined : v), z.string().max(500).optional()),
  // input type=number віддає рядок, тому coerce
  duration_minutes: z.coerce
    .number({ error: 'Вкажіть тривалість' })
    .int({ error: 'Тривалість має бути цілим числом хвилин' })
    .min(5, { error: 'Не менше 5 хвилин' })
    .max(600, { error: 'Не більше 600 хвилин' }),
  price: z.coerce
    .number({ error: 'Вкажіть вартість' })
    .positive({ error: 'Вартість має бути більшою за 0' }),
});

// Вхід форми (рядки з полів) і вихід після перетворень — різні типи
export type ServiceFormInput = z.input<typeof serviceSchema>;
export type ServiceFormData = z.output<typeof serviceSchema>;


import { z } from 'zod';

// Project validation schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  category: z.string().max(50, 'Categoria muito longa').optional().nullable(),
  status: z.enum(['ativo', 'pausado', 'concluído']).default('ativo'),
  deadline: z.string().optional().nullable(),
  tags: z.array(z.string().max(30, 'Tag muito longa')).default([]),
});

export const projectStepSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição muito longa'),
  completed: z.boolean().default(false),
});

// Habit validation schemas
export const habitSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(300, 'Descrição muito longa').optional(),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  icon: z.string().max(10, 'Ícone inválido').optional(),
  tags: z.array(z.string().max(30, 'Tag muito longa')).default([]),
});

// Athena interaction validation
export const athenaPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt é obrigatório').max(1000, 'Prompt muito longo'),
  context_type: z.string().max(50, 'Tipo de contexto muito longo').optional(),
  context_id: z.string().optional().nullable(),
});

// User profile validation
export const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  bio: z.string().max(500, 'Bio muito longa').optional(),
});

// Form validation helpers
export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectStepFormData = z.infer<typeof projectStepSchema>;
export type HabitFormData = z.infer<typeof habitSchema>;
export type AthenaPromptData = z.infer<typeof athenaPromptSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Validation error formatter
export function formatZodError(error: z.ZodError): string {
  return error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
}

// Safe validation wrapper
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: formatZodError(error) };
    }
    return { success: false, error: 'Erro de validação desconhecido' };
  }
}

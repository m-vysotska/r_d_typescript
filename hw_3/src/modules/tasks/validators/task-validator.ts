import { z } from 'zod';

export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  entityName: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`${entityName} validation failed: ${errorMessages}`);
    }
    throw error;
  }
}


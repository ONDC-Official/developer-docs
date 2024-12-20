import { Schema, ValidationError } from 'joi';

/**
 * Performs schema validation on the provided data using the given schema definition.
 *
 * @param schema - The schema definition used for validation.
 * @param data - The data to be validated against the schema.
 * @returns A `ValidationError` object if the data fails validation, or `undefined` if the data is valid.
 * @template T - The type of data to be validated.
 */

export function SchemaValidator<T>({ schema, data }: { schema: Schema; data: T }): ValidationError | undefined {
  const { error } = schema.validate(data, { abortEarly: false });

  return error;
}

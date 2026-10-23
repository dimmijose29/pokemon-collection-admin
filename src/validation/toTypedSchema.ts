import type { TypedSchema, TypedSchemaError } from 'vee-validate'
import type { z } from 'zod'

/**
 * Adattatore Zod 4 → VeeValidate.
 *
 * Il pacchetto ufficiale @vee-validate/zod dichiara ancora zod ^3 come peer dependency
 * (npm rifiuta l'installazione con Zod 4): questo adattatore fa lo stesso lavoro,
 * raggruppando gli errori di Zod per percorso del campo come se li aspetta VeeValidate.
 */
export function toTypedSchema<S extends z.ZodType>(
  schema: S,
): TypedSchema<z.input<S>, z.output<S>> {
  return {
    __type: 'VVTypedSchema',
    async parse(values) {
      const result = await schema.safeParseAsync(values)
      if (result.success) return { value: result.data, errors: [] }

      const byPath = new Map<string, string[]>()
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        byPath.set(path, [...(byPath.get(path) ?? []), issue.message])
      }
      const errors: TypedSchemaError[] = [...byPath].map(([path, messages]) => ({
        path,
        errors: messages,
      }))
      return { errors }
    },
  }
}

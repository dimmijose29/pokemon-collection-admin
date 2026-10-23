import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { toTypedSchema } from '@/validation/toTypedSchema'
import { optionalInteger, requiredString } from '@/validation/schemas'

describe('toTypedSchema', () => {
  const schema = toTypedSchema(
    z.object({
      name: requiredString('Nome obbligatorio'),
      count: optionalInteger(),
      nested: z.object({ code: z.string().min(2, 'Troppo corto') }),
    }),
  )

  it('restituisce i valori trasformati quando lo schema è valido', async () => {
    const result = await schema.parse({ name: '  Pikachu ', count: '12', nested: { code: 'AB' } })
    expect(result.errors).toEqual([])
    expect(result.value).toEqual({ name: 'Pikachu', count: 12, nested: { code: 'AB' } })
  })

  it('raggruppa gli errori per percorso del campo', async () => {
    const result = await schema.parse({ name: '', count: 'abc', nested: { code: 'A' } })
    expect(result.value).toBeUndefined()
    expect(result.errors).toEqual(
      expect.arrayContaining([
        { path: 'name', errors: ['Nome obbligatorio'] },
        { path: 'count', errors: ['Inserisci un numero intero'] },
        { path: 'nested.code', errors: ['Troppo corto'] },
      ]),
    )
  })
})

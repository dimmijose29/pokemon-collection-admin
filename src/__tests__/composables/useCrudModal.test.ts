import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useCrudModal } from '@/composables/useCrudModal'
import { useModalStore } from '@/stores/modal'
import { withSetup } from '../helpers/withSetup'

function setup(toPayload?: (data: object) => { name: string }) {
  const api = {
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
  }
  const { result, queryClient } = withSetup(() =>
    useCrudModal<{ name: string }>({
      api,
      queryKey: 'things',
      messages: { created: 'Creato', updated: 'Aggiornato' },
      toPayload,
    }),
  )
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
  return { modal: result, api, invalidate, store: useModalStore() }
}

describe('useCrudModal', () => {
  it('in creazione chiama create, invalida la cache e chiude la modale', async () => {
    const { modal, api, invalidate, store } = setup()
    store.open()

    await modal.handleSubmit({ name: 'Nuovo' })
    await flushPromises()

    expect(api.create).toHaveBeenCalledWith({ name: 'Nuovo' })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['things'] })
    expect(store.isOpen).toBe(false)
  })

  it("in modifica chiama update con l'id del record aperto", async () => {
    const { modal, api, store } = setup()
    store.open({ id: 7, name: 'Vecchio' })

    await modal.handleSubmit({ name: 'Nuovo' })

    expect(api.update).toHaveBeenCalledWith(7, { name: 'Nuovo' })
  })

  it('usa toPayload e lascia aperta la modale se il salvataggio fallisce', async () => {
    const { modal, api, store } = setup((d) => ({ name: String((d as { n: string }).n) }))
    api.create.mockRejectedValueOnce(new Error('boom'))
    store.open()

    await modal.handleSubmit({ n: 'x' })

    expect(api.create).toHaveBeenCalledWith({ name: 'x' })
    expect(store.isOpen).toBe(true)
    expect(modal.allErrors.value).toEqual(['Errore generico'])
  })
})

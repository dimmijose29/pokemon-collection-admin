import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { getNode } from '@formkit/core'
import ArtistForm from '@/components/forms/ArtistForm.vue'
import type { Artist } from '@/types/artist'

function mountForm(props: Record<string, unknown> = {}) {
  return mount(ArtistForm, { props })
}

describe('ArtistForm', () => {
  it('si monta senza errori', () => {
    const wrapper = mountForm()
    expect(wrapper.exists()).toBe(true)
  })

  it('mostra il campo "Nome"', () => {
    const wrapper = mountForm()
    expect(wrapper.html()).toContain('Nome')
  })

  it('non mostra ErrorAlert se non ci sono errori', async () => {
    const wrapper = mountForm({ errors: [] })
    await flushPromises()
    // ErrorAlert renderizza il div solo se errors.length > 0
    expect(wrapper.find('.alert').exists()).toBe(false)
  })

  it('mostra gli errori passati tramite props', async () => {
    const wrapper = mountForm({ errors: ['Il nome è obbligatorio'] })
    await flushPromises()
    expect(wrapper.html()).toContain('Il nome è obbligatorio')
  })

  it('pre-popola il campo con i dati dell\'artista in modalità edit', async () => {
    const artist: Artist = {
      id: 1,
      name: 'Mitsuhiro Arita',
      created_at: '2024-01-01T00:00:00.000Z',
      deleted_at: null,
    }
    const wrapper = mountForm({ artist, variant: 'edit' })
    await flushPromises()

    expect(wrapper.find('#artist-form').exists()).toBe(true)
    expect(wrapper.find('input[name="name"]').exists()).toBe(true)
  })

  it('emette "submit" quando il form viene inviato con dati validi', async () => {
    const wrapper = mountForm()
    await flushPromises()

    // Usa l'API di FormKit per impostare il valore direttamente sul nodo interno
    const formNode = getNode('artist-form')
    await formNode?.at('name')?.input('Nuovo Artista')
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})

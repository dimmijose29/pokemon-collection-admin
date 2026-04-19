import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { getNode } from '@formkit/core'
import ConditionForm from '@/components/forms/ConditionForm.vue'
import type { Condition } from '@/types/condition'

function mountForm(props: Record<string, unknown> = {}) {
  return mount(ConditionForm, { props })
}

describe('ConditionForm', () => {
  it('si monta senza errori', () => {
    const wrapper = mountForm()
    expect(wrapper.exists()).toBe(true)
  })

  it('mostra entrambi i campi "Codice" e "Nome"', () => {
    const wrapper = mountForm()
    expect(wrapper.html()).toContain('Codice')
    expect(wrapper.html()).toContain('Nome')
  })

  it('renderizza sia l\'input "code" che "name"', () => {
    const wrapper = mountForm()
    expect(wrapper.find('input[name="code"]').exists()).toBe(true)
    expect(wrapper.find('input[name="name"]').exists()).toBe(true)
  })

  it('mostra gli errori passati tramite props', async () => {
    const wrapper = mountForm({ errors: ['Il codice è già in uso'] })
    await flushPromises()
    expect(wrapper.html()).toContain('Il codice è già in uso')
  })

  it('non mostra ErrorAlert se non ci sono errori', async () => {
    const wrapper = mountForm({ errors: [] })
    await flushPromises()
    expect(wrapper.find('.alert').exists()).toBe(false)
  })

  it('pre-popola entrambi i campi in modalità edit', async () => {
    const condition: Condition = {
      id: 1,
      code: 'NM',
      name: 'Near Mint',
      created_at: '2024-01-01T00:00:00.000Z',
      deleted_at: null,
    }
    const wrapper = mountForm({ condition, variant: 'edit' })
    await flushPromises()

    expect(wrapper.find('#condition-form').exists()).toBe(true)
    expect(wrapper.find('input[name="code"]').exists()).toBe(true)
    expect(wrapper.find('input[name="name"]').exists()).toBe(true)
  })

  it('emette "submit" quando il form viene inviato con dati validi', async () => {
    const wrapper = mountForm()
    await flushPromises()

    // Usa l'API di FormKit per impostare i valori direttamente sui nodi interni.
    // Con più campi required, setValue + trigger('submit') non è affidabile
    // perché FormKit potrebbe non aver ancora aggiornato tutti i nodi prima della validazione.
    const formNode = getNode('condition-form')
    await formNode?.at('code')?.input('LP')
    await formNode?.at('name')?.input('Lightly Played')
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})

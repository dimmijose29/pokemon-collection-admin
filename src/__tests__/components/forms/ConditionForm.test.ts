import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import ConditionForm from '@/components/forms/ConditionForm.vue'
import type { Condition } from '@/types/condition'

const condition: Condition = {
  id: 1,
  code: 'NM',
  name: 'Near Mint',
  created_at: '2024-01-15',
  deleted_at: null,
}

const submitForm = () => fireEvent.submit(document.querySelector('#condition-form')!)

describe('ConditionForm', () => {
  it('mostra i campi "Codice" e "Nome"', () => {
    render(ConditionForm)
    expect(screen.getByLabelText('Codice')).toBeTruthy()
    expect(screen.getByLabelText('Nome')).toBeTruthy()
  })

  it('mostra gli errori passati tramite props', () => {
    render(ConditionForm, { props: { errors: ['Questo codice è già in uso'] } })
    expect(screen.getByText('Questo codice è già in uso')).toBeTruthy()
  })

  it('pre-popola entrambi i campi in modifica', () => {
    render(ConditionForm, { props: { condition, variant: 'edit' } })
    expect((screen.getByLabelText('Codice') as HTMLInputElement).value).toBe('NM')
    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('Near Mint')
  })

  it('emette "submit" con codice e nome (senza spazi ai bordi)', async () => {
    const { emitted } = render(ConditionForm)
    await userEvent.type(screen.getByLabelText('Codice'), ' LP ')
    await userEvent.type(screen.getByLabelText('Nome'), 'Lightly Played')
    await submitForm()

    await waitFor(() => expect(emitted().submit).toBeTruthy())
    expect(emitted().submit![0]).toEqual([{ code: 'LP', name: 'Lightly Played' }])
  })

  it('mostra un messaggio per ogni campo obbligatorio vuoto', async () => {
    const { emitted } = render(ConditionForm)
    await submitForm()

    expect(await screen.findByText('Il codice è obbligatorio')).toBeTruthy()
    expect(screen.getByText('Il nome è obbligatorio')).toBeTruthy()
    expect(emitted().submit).toBeUndefined()
  })
})

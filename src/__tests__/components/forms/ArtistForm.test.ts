import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import ArtistForm from '@/components/forms/ArtistForm.vue'
import type { Artist } from '@/types/artist'

const artist: Artist = {
  id: 1,
  name: 'Mitsuhiro Arita',
  created_at: '2024-01-15',
  updated_at: '2024-01-15',
  deleted_at: null,
}

// Il pulsante Salva sta nella modale: nei test si invia il form direttamente
const submitForm = () => fireEvent.submit(document.querySelector('#artist-form')!)

describe('ArtistForm', () => {
  it('mostra il campo "Nome" con l\'asterisco degli obbligatori', () => {
    render(ArtistForm)
    expect(screen.getByLabelText('Nome')).toBeTruthy()
    expect(screen.getByTitle('Campo obbligatorio')).toBeTruthy()
  })

  it('non mostra errori se non ce ne sono', () => {
    render(ArtistForm, { props: { errors: [] } })
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('mostra gli errori passati tramite props', () => {
    render(ArtistForm, { props: { errors: ['Questo artista è stato già inserito'] } })
    expect(screen.getByText('Questo artista è stato già inserito')).toBeTruthy()
  })

  it("pre-popola il campo con i dati dell'artista in modifica", () => {
    render(ArtistForm, { props: { artist, variant: 'edit' } })
    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('Mitsuhiro Arita')
  })

  it('emette "submit" con il payload quando i dati sono validi', async () => {
    const { emitted } = render(ArtistForm)
    await userEvent.type(screen.getByLabelText('Nome'), 'Ken Sugimori')
    await submitForm()

    await waitFor(() => expect(emitted().submit).toBeTruthy())
    expect(emitted().submit![0]).toEqual([{ name: 'Ken Sugimori' }])
  })

  it('passare su un campo vuoto senza scrivere non mostra errori', async () => {
    render(ArtistForm)
    await userEvent.click(screen.getByLabelText('Nome'))
    await userEvent.tab()

    expect(screen.queryByRole('alert')).toBeNull()
  })

  it("cancellare il nome e uscire dal campo mostra subito l'errore", async () => {
    render(ArtistForm, { props: { artist, variant: 'edit' } })
    await userEvent.clear(screen.getByLabelText('Nome'))
    await userEvent.tab()

    expect(await screen.findByText('Il nome è obbligatorio')).toBeTruthy()
  })

  it("blocca l'invio e mostra il messaggio se il nome è vuoto", async () => {
    const { emitted } = render(ArtistForm)
    await submitForm()

    expect(await screen.findByText('Il nome è obbligatorio')).toBeTruthy()
    expect(emitted().submit).toBeUndefined()
  })
})

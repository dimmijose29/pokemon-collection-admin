import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import BaseDataTable from '@/components/base/BaseDataTable.vue'
import type { DataColumn } from '@/components/base/dataTable'

interface Row {
  id: number
  name: string
  count: number
  release_date: string | null
}

const columns: DataColumn<Row>[] = [
  { id: 'name', label: 'Nome' },
  { id: 'count', label: 'Carte' },
  { id: 'release_date', label: 'Uscita' },
  { id: 'actions' },
]

const rows: Row[] = [
  { id: 1, name: 'Bravo', count: 10, release_date: '2024-03-01' },
  { id: 2, name: 'alfa', count: 2, release_date: null },
  { id: 3, name: 'Charlie', count: 30, release_date: '2023-01-01' },
]

// Testo della prima cella di ogni riga del corpo
const firstColumn = () =>
  within(screen.getAllByRole('rowgroup')[1]!)
    .getAllByRole('row')
    .map((r) => r.querySelector('td')!.textContent!.trim())

describe('BaseDataTable', () => {
  it('mostra le righe e il valore della colonna come cella di default', () => {
    render(BaseDataTable, { props: { rows, columns } })
    expect(firstColumn()).toEqual(['Bravo', 'alfa', 'Charlie'])
    expect(screen.getByText('30')).toBeTruthy()
  })

  it("ordina cliccando l'intestazione: crescente, poi decrescente", async () => {
    render(BaseDataTable, { props: { rows, columns } })

    await userEvent.click(screen.getByRole('button', { name: /Carte/ }))
    expect(firstColumn()).toEqual(['alfa', 'Bravo', 'Charlie'])

    await userEvent.click(screen.getByRole('button', { name: /Carte/ }))
    expect(firstColumn()).toEqual(['Charlie', 'Bravo', 'alfa'])
  })

  it('mette in fondo i valori mancanti quando ordina per data', async () => {
    render(BaseDataTable, { props: { rows, columns } })
    await userEvent.click(screen.getByRole('button', { name: /Uscita/ }))
    expect(firstColumn()).toEqual(['Charlie', 'Bravo', 'alfa'])
  })

  it('le colonne senza etichetta non sono ordinabili', () => {
    render(BaseDataTable, { props: { rows, columns } })
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('pagina le righe', async () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Riga ${String(i + 1).padStart(2, '0')}`,
      count: i,
      release_date: null,
    }))
    render(BaseDataTable, { props: { rows: many, columns, pageSize: 25 } })

    expect(firstColumn()).toHaveLength(25)
    expect(screen.getByText('Pagina 1 di 2')).toBeTruthy()

    await userEvent.click(screen.getByRole('button', { name: 'Pagina successiva' }))
    expect(firstColumn()).toEqual(['Riga 26', 'Riga 27', 'Riga 28', 'Riga 29', 'Riga 30'])
  })

  it("usa lo slot della cella quando c'è", () => {
    render(BaseDataTable, {
      props: { rows, columns },
      slots: { 'cell-actions': '<button>Azione</button>' },
    })
    expect(screen.getAllByText('Azione')).toHaveLength(3)
  })

  it('mostra il messaggio quando non ci sono righe', () => {
    render(BaseDataTable, { props: { rows: [], columns } })
    expect(screen.getByText('Nessun risultato trovato.')).toBeTruthy()
  })
})

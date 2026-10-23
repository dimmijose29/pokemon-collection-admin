/** Colonna di BaseDataTable: `id` è il campo della riga, salvo `accessor` diverso. */
export interface DataColumn<R> {
  id: string
  label?: string
  /** Valore usato per ordinare e per la cella di default (default: row[id]). */
  accessor?: (row: R) => unknown
  /** Ordinabile (default: sì se ha un'etichetta). */
  sortable?: boolean
  /** Confronto personalizzato; senza, TanStack sceglie in base al tipo del valore. */
  sortingFn?: (a: R, b: R) => number
  /** Classi di th e td per larghezza e visibilità responsive (es. 'hidden md:table-cell w-24'). */
  class?: string
}

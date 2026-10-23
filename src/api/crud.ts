import https from '@/api/https'

/** Parametri accettati dalle liste di catalogo. */
export interface ListParams {
  withTrashed?: boolean
}

/** Operazioni standard di un'entità di catalogo (vedi CatalogController lato API). */
export interface CrudApi<T, P, Q extends ListParams = ListParams> {
  get: (params?: Q) => Promise<T[]>
  getById: (id: number) => Promise<T>
  create: (payload: P) => Promise<T>
  update: (id: number, payload: P) => Promise<T>
  remove: (id: number) => Promise<void>
  restore: (id: number) => Promise<void>
}

/**
 * Crea il client di un'entità di catalogo a partire dal path (es. '/artists').
 * Tutte le entità espongono le stesse rotte, quindi cambia solo il path e i tipi.
 */
export function createCrudApi<T, P, Q extends ListParams = ListParams>(
  path: string,
): CrudApi<T, P, Q> {
  return {
    get: async (params) => (await https.get(path, { params })).data,
    getById: async (id) => (await https.get(`${path}/${id}`)).data,
    create: async (payload) => (await https.post(path, payload)).data,
    update: async (id, payload) => (await https.put(`${path}/${id}`, payload)).data,
    remove: async (id) => {
      await https.delete(`${path}/${id}`)
    },
    restore: async (id) => {
      await https.put(`${path}/${id}/restore`)
    },
  }
}

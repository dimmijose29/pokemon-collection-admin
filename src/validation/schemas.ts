/**
 * Regole di validazione riutilizzabili (Zod), con i messaggi in italiano.
 * Ogni form compone il proprio schema da qui, senza ripetere messaggi o regole.
 * La validazione autoritativa resta lato API: queste regole servono a rispondere subito.
 */
import { z } from 'zod'

export const validationMessages = {
  required: 'Questo campo è obbligatorio',
  email: "Inserisci un'email valida",
  otp: 'Inserisci il codice a 6 cifre',
  confirm: 'Le password non coincidono',
} as const

// Espressione volutamente semplice: il controllo vero lo fa il backend.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Stringa obbligatoria (con trim): `message` è il testo mostrato se vuota. */
export function requiredString(message: string = validationMessages.required) {
  return z.string({ message }).trim().min(1, message)
}

/** Stringa facoltativa: vuota o assente è valida. */
export function optionalString() {
  return z.string().trim().optional()
}

export function emailField(message: string = validationMessages.required) {
  return requiredString(message).regex(EMAIL_RE, validationMessages.email)
}

export function passwordField(min = 8, message: string = validationMessages.required) {
  return requiredString(message).min(min, `Minimo ${min} caratteri`)
}

export function otpField() {
  return z.string().regex(/^[0-9]{6}$/, validationMessages.otp)
}

/** Numero intero facoltativo da un input (stringa vuota = assente). */
export function optionalInteger() {
  return z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 0), 'Inserisci un numero intero')
}

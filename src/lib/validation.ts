const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const passwordRequirementsMessage = "Parola trebuie să aibă minimum 8 caractere, cel puțin o literă, o cifră și un simbol."

export function isValidPassword(password: string) {
  return PASSWORD_PATTERN.test(password)
}

export function isValidPhoneNumber(phoneNumber: string) {
  return /^\d{10}$/.test(phoneNumber)
}

export function isValidPostalCode(postalCode: string) {
  return /^\d{6}$/.test(postalCode)
}

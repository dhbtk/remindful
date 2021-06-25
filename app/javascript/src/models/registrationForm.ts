export interface RegistrationFormState {
  email: string
  name: string
  avatarUrl: string
  password: string
  passwordConfirmation: string
  pronouns: Pronouns | null
  agreeToTerms: boolean
}

export type Pronouns = 'male' | 'female' | 'neutral'

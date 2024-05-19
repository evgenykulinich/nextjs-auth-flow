import type { Metadata } from 'next'

import { RegisterForm } from '@/components/auth/form/register-form'

export const metadata: Metadata = {
  title: '',
  description: ''
}

export default function RegisterPage() {
  return <RegisterForm />
}

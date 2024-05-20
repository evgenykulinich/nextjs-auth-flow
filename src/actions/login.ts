'use server'

import * as z from 'zod'
import { AuthError } from 'next-auth'

import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Incorrect username or password!' }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Incorrect username or password!' }

        default:
          return { error: 'Something went wrong! Try again' }
      }
    }

    throw error // Have to do that otherwise it will not redirect to DEFAULT_LOGIN_REDIRECT
  }
}

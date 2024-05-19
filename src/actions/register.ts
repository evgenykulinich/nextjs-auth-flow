'use server'

import * as z from 'zod'
import bcrypt from 'bcrypt'

import { RegisterSchema } from '@/schemas'
import { prisma } from '@/lib/db'
import { getUserByEmail } from '@/helpers/users'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Something went wrong! Try again' }
  }

  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: 'Email already in use!' }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return { success: 'Successfully registered!' }
}
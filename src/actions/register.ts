'use server'

import bcrypt from 'bcryptjs'
import * as z from 'zod'

import { RegisterSchema } from '@/schemas'
import { prisma } from '@/lib/db'
import { getUserByEmail } from '@/helpers/users'
import { sendVerificationEmail } from '@/helpers/mail'
import { generateVerificationToken } from '@/helpers/tokens'
import { statusMessage } from '@/messages/statusMessage'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  if (!validatedFields.success) return { error: statusMessage.error.incorrectFields }

  const { name, email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (existingUser) return { error: statusMessage.error.emailTaken }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: statusMessage.success.confirmationEmail }
}

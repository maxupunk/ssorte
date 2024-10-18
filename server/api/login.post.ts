import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from "~~/server/prisma";
const config = useRuntimeConfig();

const SECRETJWT = config.secretJwt as string

export default defineEventHandler(async (event) => {
  let body = await readBody(event);
  const user = await prisma.user.findUnique({ where: { email: body.email } })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Credenciais invalidas' })
  }
  const valid = await bcrypt.compare(body.password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Credenciais invalidas' })
  }
  const token = jwt.sign({ id: user.id, name: user.name ,rule: user.rule }, SECRETJWT, { expiresIn: '1000h' })
  return {
    user: { id: user.id, name: user.name, email: user.email, rule: user.rule },
    token
  }
})

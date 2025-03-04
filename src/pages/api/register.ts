import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export default async function handler(
  req: { method: string; body: { username: any; password: any } },
  res: any
) {
  if (req.method === 'POST') {
    const { username, password } = req.body
    // 检查用户名是否存在
    try {
      const existingUser = await prisma.users.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      })

      if (existingUser) {
        // 如果用户名已存在，返回错误消息
        return res.status(400).json({ message: '用户名已存在' })
      }

      // 如果用户名不存在，继续注册
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.users.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      })

      res.status(201).json({ message: '注册成功', user })
    } catch (error) {
      res.status(500).json({ message: '注册失败', error })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

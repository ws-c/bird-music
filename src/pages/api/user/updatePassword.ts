import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 更新用户信息
export default async function handler(
  req: { method: string; body: { password: any; newPassword: any; id: any } },
  res: any
) {
  if (req.method === 'PUT') {
    try {
      const { password, newPassword, id } = req.body

      // 1. 从数据库获取用户信息
      const user = await prisma.users.findUnique({
        where: { id },
        select: { id: true, password: true },
      })

      if (!user) {
        return res.status(404).json({ error: '用户不存在' })
      }

      // 2. 校验当前密码是否正确
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(400).json({ error: '当前密码错误' })
      }

      // 3. 更新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await prisma.users.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      })

      res.status(200).json({ msg: '更新成功', code: 200 })
    } catch (error) {
      console.error('Error during update:', error)
      res.status(500).json({ error: '更新失败，请稍后重试' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

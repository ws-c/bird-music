import prisma from '../../../lib/prisma'

// 更新用户信息
export default async function handler(
  req: { method: string; body: { cover: any; username: any; oldName: any } },
  res: any
) {
  if (req.method === 'PUT') {
    try {
      const { cover, username, oldName } = req.body

      // 检查 username 是否已经存在
      if (oldName !== username) {
        const existingUser = await prisma.users.findUnique({
          where: { username },
        })
        if (existingUser) {
          return res.status(400).json({ error: '用户名已被占用' })
        }
      }

      // 检查 oldName 是否存在
      const user = await prisma.users.findUnique({
        where: { username: oldName },
      })
      if (!user) {
        return res.status(400).json({ error: '用户不存在' })
      }

      // 使用事务同步更新
      const result = await prisma.$transaction([
        prisma.playlist.updateMany({
          where: { author: oldName },
          data: { author: username },
        }),
        prisma.users.update({
          where: { id: user.id },
          data: {
            username,
            cover,
          },
          select: { id: true, username: true, cover: true },
        }),
      ])

      res.status(200).json({ msg: '更新成功', code: 200, data: result[1] })
    } catch (error) {
      console.error('Error during update:', error)
      res.status(500).json({ error: '更新失败，请稍后重试' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

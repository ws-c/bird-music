import prisma from '../../../../../lib/prisma'

// 获取用户自己创建的歌单
export default async function handler(
  req: { method: string; query: { id: any } },
  res: any
) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      // 获取歌单
      const playlist = await prisma.playlist.findUnique({
        where: {
          id: +id,
        },
      })

      if (!playlist) {
        return res.status(404).json({ error: 'No playlist found' })
      }

      // 获取用户封面图
      const user = await prisma.users.findUnique({
        where: {
          username: playlist.author,
        },
        select: {
          cover: true,
        },
      })

      // 如果用户没有设置封面图，使用默认空字符串
      const cover = user?.cover ?? ''

      // 返回合并后的结果
      res.status(200).json({ cover, ...playlist })
    } catch (error) {
      console.error('Error fetching playlist:', error)
      res.status(500).json({ error: 'Failed to fetch playlist' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

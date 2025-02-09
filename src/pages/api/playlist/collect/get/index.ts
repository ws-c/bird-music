import prisma from '@/lib/prisma'

// 获取用户收藏的所有歌单
export default async function handler(
  req: { method: string; query: { id: string } },
  res: any
) {
  if (req.method === 'GET') {
    // 获取用户的所有收藏的歌单
    try {
      const playlists = await prisma.playlist_collect.findMany({
        where: {
          user_id: +req.query.id, // 根据用户ID查询收藏记录
        },
        select: {
          playlist: {
            // 获取每个收藏记录关联的歌单
            select: {
              id: true,
              name: true,
              img: true,
            },
          },
        },
      })

      // 提取收藏的歌单数据
      const userPlaylists = playlists.map((collection) => collection.playlist)

      res.status(200).json(userPlaylists)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user playlists' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

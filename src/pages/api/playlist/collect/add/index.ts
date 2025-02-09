import prisma from '@/lib/prisma'

export default async function handler(
  req: { method: string; body: { userId: any; playlistId: any } },
  res: any
) {
  if (req.method === 'POST') {
    const { userId, playlistId } = req.body // 获取请求体中的用户ID和歌单ID

    try {
      // 1. 检查用户是否已经收藏该歌单
      const existingCollection = await prisma.playlist_collect.findUnique({
        where: {
          user_id_playlist_id: {
            user_id: userId,
            playlist_id: playlistId,
          },
        },
      })

      if (existingCollection) {
        // 2. 如果已经收藏，返回一个错误
        return res.status(400).json({ error: '你已收藏过该歌单' })
      }

      // 3. 如果未收藏，插入新的收藏记录
      await prisma.playlist_collect.create({
        data: {
          user_id: userId,
          playlist_id: playlistId,
          collected_at: new Date(), // 收藏时间
        },
      })

      // 4. 返回成功的响应
      return res.status(200).json({ code: 200, message: '收藏歌单成功' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to add playlist to collection.' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

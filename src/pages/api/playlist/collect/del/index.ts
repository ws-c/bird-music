import prisma from '@/lib/prisma'

// 取消收藏歌单
export default async function handler(
  req: { method: string; body: { user_id: number; playlist_id: number } },
  res: any
) {
  if (req.method === 'DELETE') {
    const { user_id, playlist_id } = req.body
    try {
      const result = await prisma.playlist_collect.delete({
        where: {
          user_id_playlist_id: {
            user_id,
            playlist_id,
          },
        },
      })
      console.log(result)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

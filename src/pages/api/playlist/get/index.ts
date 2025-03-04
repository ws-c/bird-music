import prisma from '@/lib/prisma'
// 获取用户自己的所有歌单
export default async function handler(
  req: { method: string; query: { id: any } },
  res: any
) {
  if (req.method === 'GET') {
    try {
      const playlist = await prisma.playlist.findMany({
        where: {
          user_id: +req.query.id,
        },
      })
      res.status(200).json(playlist)
    } catch (error) {
      res.status(500).json({ error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

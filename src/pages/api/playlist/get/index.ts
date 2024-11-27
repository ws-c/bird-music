import prisma from '@/lib/prisma'
// 获取用户自己创建的歌单
export default async function handler(
  req: { method: string; query: { author: any } },
  res: any
) {
  if (req.method === 'GET') {
    // 获取用户的所有歌单
    try {
      const playlist = await prisma.playlist.findMany({
        where: {
          author: req.query.author,
        },
        select: {
          id: true,
          name: true,
          img: true,
        },
      })
      res.status(200).json(playlist)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch playlist' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

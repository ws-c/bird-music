import prisma from '@/lib/prisma'
// 首页推荐歌单
export default async function handler(req: { method: string }, res: any) {
  if (req.method === 'GET') {
    try {
      const playlist = await prisma.playlist.findMany({
        where: {
          isPrivate: {
            not: '1',
          },
        },
        take: 8,
        orderBy: {
          create_time: 'desc',
        },
      })
      res.status(200).json(playlist)
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch playlist: ${error}` })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

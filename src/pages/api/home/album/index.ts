import prisma from '@/lib/prisma'

export default async function handler(req: { method: string }, res: any) {
  if (req.method === 'GET') {
    try {
      const albums = await prisma.albums.findMany({
        take: 7,
        orderBy: {
          release_date: 'desc',
        },
        include: {
          songs: true,
          artists: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      res.status(200).json(albums)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch albums' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!req.query.id) {
      try {
        const albums = await prisma.albums.findMany({
          take: 3,
          orderBy: {
            release_date: 'desc',
          },
        })
        res.status(200).json(albums)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch albums' })
      }
    } else {
      try {
        const album = await prisma.albums.findUnique({
          where: {
            id: Number(req.query.id),
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
        res.status(200).json(album)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch album' })
      }
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

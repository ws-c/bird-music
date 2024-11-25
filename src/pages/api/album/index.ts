import prisma from '../../../lib/prisma'

export default async function handler(
  req: { method: string; query: { id: any } },
  res: any
) {
  if (req.method === 'GET' && req.query.id) {
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
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

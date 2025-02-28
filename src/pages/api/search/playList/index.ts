import prisma from '@/lib/prisma'

export default async function handler(
  req: { method: string; query: { keyword: string } },
  res: any
) {
  if (req.method === 'GET') {
    try {
      const playlist = await prisma.playlist.findMany({
        where: {
          name: req.query.keyword,
          isPrivate: {
            not: '1',
          },
        },
        select: {
          id: true,
          name: true,
          img: true,
        },
      })
      res.status(200).json(playlist)
    } catch (error) {
      console.error('Error during search:', error)
      res.status(500).json({ error: 'Failed to fetch search results' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

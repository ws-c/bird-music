import prisma from '@/lib/prisma'

export default async function handler(
  req: { method: string; query: { keyword: string } },
  res: any
) {
  if (req.method === 'GET') {
    try {
      const query = req.query.keyword?.trim() // 获取查询关键字
      if (!query) {
        return res
          .status(400)
          .json({ error: 'Query parameter "q" is required' })
      }
      const albumList = await prisma.albums.findMany({
        where: {
          OR: [
            { album_title: { contains: query } },
            { artists: { name: { contains: query } } },
          ],
        },
        select: {
          id: true,
          album_title: true,
          cover: true,
          release_date: true,
          artists: {
            select: {
              name: true,
            },
          },
        },
      })
      res.status(200).json(albumList)
    } catch (error) {
      console.error('Error during search:', error)
      res.status(500).json({ error: 'Failed to fetch search results' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

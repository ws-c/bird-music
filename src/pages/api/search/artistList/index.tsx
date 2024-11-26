import prisma from '../../../../lib/prisma'

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
      const artistList = await prisma.artists.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        select: {
          id: true,
          name: true,
          image_url: true,
        },
      })

      res.status(200).json(artistList)
    } catch (error) {
      console.error('Error during search:', error)
      res.status(500).json({ error: 'Failed to fetch search results' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

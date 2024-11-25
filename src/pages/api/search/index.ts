import prisma from '../../../lib/prisma'

export default async function handler(
  req: { method: string; query: { q: string } },
  res: any
) {
  if (req.method === 'GET') {
    try {
      const query = req.query.q?.trim() // 获取查询关键字
      if (!query) {
        return res
          .status(400)
          .json({ error: 'Query parameter "q" is required' })
      }

      // 使用 Prisma 查询
      const results1 = await prisma.songs.findMany({
        where: {
          song_title: {
            startsWith: query, // 模糊匹配，匹配以 query 开头的标题
          },
        },
        select: {
          song_title: true,
        },
      })
      const results2 = await prisma.albums.findMany({
        where: {
          album_title: {
            startsWith: query, // 模糊匹配，匹配以 query 开头的标题
          },
        },
        select: {
          album_title: true,
        },
      })
      const results3 = await prisma.artists.findMany({
        where: {
          name: {
            startsWith: query, // 模糊匹配，匹配以 query 开头的标题
          },
        },
        select: {
          name: true,
        },
      })
      // 将结果合并并去重
      const mergedResults = [
        ...results1.map((item) => ({
          label: item.song_title,
          value: item.song_title,
        })),
        ...results2.map((item) => ({
          label: item.album_title,
          value: item.album_title,
        })),
        ...results3.map((item) => ({ label: item.name, value: item.name })),
      ]

      // 根据 title 去重
      const uniqueResults = Array.from(
        new Map(mergedResults.map((item) => [item.label, item])).values()
      )
      res.status(200).json(uniqueResults)
    } catch (error) {
      console.error('Error during search:', error)
      res.status(500).json({ error: 'Failed to fetch search results' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

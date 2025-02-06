import prisma from '@/lib/prisma'
import flattenObject from '@/helpers/flattenObject'

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

      const songs = await prisma.songs.findMany({
        // distinct: ['albums_id'],
        where: {
          OR: [
            {
              song_title: {
                contains: query,
              },
            },
            {
              albums: {
                album_title: { contains: query },
              },
            },
            {
              song_artists: {
                some: {
                  artists: {
                    name: {
                      contains: query, // 通过 song_artists 关联过滤艺术家名字
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          albums: {
            release_date: 'desc', // 按专辑发布日期降序排序
          },
        },
        take: 12,
        include: {
          albums: {
            select: {
              cover: true, // 获取专辑封面
              release_date: true, // 获取专辑发布日期
              album_title: true, // 获取专辑标题
            },
          },
          song_artists: {
            select: {
              artists: {
                select: {
                  name: true, // 获取艺术家名字
                },
              },
            },
          },
        },
      })

      // 扁平化查询结果
      const newSongs = songs.map((song) => flattenObject(song))
      res.status(200).json(newSongs)
    } catch (error) {
      console.error('Error during search:', error)
      res.status(500).json({ error: 'Failed to fetch search results' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

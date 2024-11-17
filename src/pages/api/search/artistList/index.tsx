import prisma from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = req.query.keyword?.trim() // 获取查询关键字
      if (!query) {
        return res
          .status(400)
          .json({ error: 'Query parameter "q" is required' })
      }
      const artistList = await prisma.songs.findMany({
        where: {
          OR: [
            {
              song_title: {
                contains: query,
              },
            },
            {
              artists: {
                name: {
                  contains: query,
                },
              },
            },
            {
              albums: {
                album_title: {
                  contains: query,
                },
              },
            },
          ],
        },
        select: {
          artists: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
          },
        },
      })

      // 提取并去重
      const uniqueArtistsMap = new Map() // 用 Map 存储唯一的 artist 对象

      artistList.forEach((song) => {
        const artist = song.artists // 直接获取对象
        if (!uniqueArtistsMap.has(artist.id)) {
          uniqueArtistsMap.set(artist.id, artist)
        }
      })

      const uniqueArtists = Array.from(uniqueArtistsMap.values())

      res.status(200).json(uniqueArtists)
    } catch (error) {
      console.error('Error during search:', error)
      res.status(500).json({ error: 'Failed to fetch search results' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

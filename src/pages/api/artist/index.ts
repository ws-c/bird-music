import prisma from '../../../lib/prisma'

export default async function handler(
  req: { method: string; query: { id: string | number } },
  res: any
) {
  if (req.method === 'GET' && req.query.id) {
    try {
      const artist = await prisma.artists.findUnique({
        where: {
          id: +req.query.id, // 使用 id 查询
        },
        include: {
          song_artists: {
            include: {
              songs: {
                include: {
                  albums: {
                    select: {
                      album_title: true,
                      cover: true,
                    },
                  },
                  song_artists: {
                    select: {
                      artist_id: true, // 获取艺术家ID
                      artists: {
                        select: {
                          name: true, // 获取艺术家名字
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!artist) {
        return res.status(404).send('Artist not found.')
      }
      res.json(artist)
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

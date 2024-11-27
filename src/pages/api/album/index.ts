import prisma from '@/lib/prisma'
import flattenObject from '@/utils/flattenObject'

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
          songs: {
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
          artists: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      if (!album) return res.status(404).json({ error: 'Album not found' })

      const { songs, ...rest } = album
      const newSongs = songs.map((song) => flattenObject(song))
      const newAlbum = { ...rest, songs: newSongs }
      res.status(200).json(newAlbum)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch album' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

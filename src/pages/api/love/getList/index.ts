import prisma from '@/lib/prisma'
import flattenObject from '@/helpers/flattenObject'

// 获取用户:我喜欢的歌单
export default async function handler(
  req: { method: string; query: { id: any } },
  res: any
) {
  if (req.method === 'GET') {
    const { id } = req.query // 用户id
    try {
      const playlist = await prisma.user_likes_songs.findMany({
        where: {
          user_id: +id, // 用户id
        },
        select: {
          songs: {
            select: {
              id: true,
              song_title: true,
              duration: true,
              file_path: true,
              albums_id: true,
              lyric: true,
              song_artists: {
                select: {
                  artist_id: true,
                  artists: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              albums: {
                select: {
                  album_title: true,
                  cover: true,
                },
              },
            },
          },
        },
        orderBy: {
          liked_at: 'desc',
        },
      })

      if (!playlist) {
        return res.status(404).json({ error: 'No playlist found' })
      }
      const newPlaylist = playlist.map((item) => flattenObject(item))
      res.status(200).json(newPlaylist) // 返回匹配结果
    } catch (error) {
      res.status(500).json({ error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

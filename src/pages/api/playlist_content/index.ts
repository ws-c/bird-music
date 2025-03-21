import prisma from '@/lib/prisma'
import flattenObject from '@/helpers/flattenObject'

// 获取用户自己创建的歌单
export default async function handler(
  req: { method: string; query: { id: any } },
  res: any
) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      const playlist = await prisma.playlist_songs.findMany({
        where: {
          playlist_id: +id, // 播放列表 ID
        },
        select: {
          songs: {
            select: {
              id: true,
              song_title: true,
              duration: true,
              file_path: true,
              albums_id: true,
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

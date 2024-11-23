import prisma from '../../../lib/prisma'

// 获取用户自己创建的歌单
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    console.log('id', id)
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
              artists_id: true,
              albums: {
                select: {
                  album_title: true,
                  cover: true,
                },
              },
              artists: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      if (!playlist) {
        return res.status(404).json({ error: 'No playlist found' })
      }

      res.status(200).json(playlist) // 返回匹配结果
    } catch (error) {
      console.error('Error fetching playlist:', error)
      res.status(500).json({ error: 'Failed to fetch playlist' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

import prisma from '@/lib/prisma'

// 删除创建歌单里的歌曲
export default async function handler(
  req: {
    method: string
    body: { song_id_list: number[]; playlist_id: number }
  },
  res: any
) {
  if (req.method === 'DELETE') {
    const { song_id_list, playlist_id } = req.body

    try {
      const deletedSongs = await prisma.playlist_songs.deleteMany({
        where: {
          playlist_id: playlist_id,
          song_id: {
            in: song_id_list,
          },
        },
      })

      res.status(200).json(deletedSongs)
    } catch (error) {
      console.error('Error deleting songs from playlist:', error)
      res.status(500).json({ error: 'Failed to delete songs from playlist' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

import prisma from '@/lib/prisma'

// 删除创建的歌单
export default async function handler(
  req: {
    method: string
    body: { id: number }
  },
  res: any
) {
  if (req.method === 'DELETE') {
    const { id } = req.body

    try {
      const [deletedSong] = await prisma.$transaction([
        prisma.playlist_songs.deleteMany({
          where: {
            playlist_id: id,
          },
        }),
        prisma.playlist.delete({
          where: {
            id,
          },
        }),
      ])
      res.status(200).json(deletedSong)
    } catch (error) {
      console.error('Error deleting songs from playlist:', error)
      res.status(500).json({ error: 'Failed to delete songs from playlist' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

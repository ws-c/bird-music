import prisma from '../../../../../lib/prisma'

// 获取用户自己创建的歌单
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      const playlist = await prisma.playlist.findUnique({
        where: {
          id: +id,
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

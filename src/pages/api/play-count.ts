import prisma from '@/lib/prisma'

export default async function handler(
  req: { method: string; body: { id: number } },
  res: any
) {
  if (req.method === 'POST') {
    const { id } = req.body

    try {
      const updatedSong = await prisma.songs.update({
        where: {
          id: id,
        },
        data: {
          play_count: {
            increment: 1,
          },
        },
      })

      res.status(200).json({
        success: true,
        message: '播放量更新成功',
        play_count: updatedSong.play_count,
      })
    } catch (error) {
      console.error('播放量更新失败:', error)
      res.status(500).json({
        success: false,
        message: '播放量更新失败',
        error,
      })
    }
  } else {
    res.status(405).json({
      success: false,
      message: '仅支持 POST 请求',
    })
  }
}

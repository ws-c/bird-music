import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ResponseData {
  success: boolean
  message: string
  play_count?: number
  error?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: '仅支持 POST 请求',
    })
  }

  const { id: songId } = req.body

  if (!songId || typeof songId !== 'number') {
    return res.status(400).json({
      success: false,
      message: '参数错误：缺少有效的歌曲ID',
    })
  }

  try {
    // 使用事务处理多个操作
    await prisma.$transaction([
      // 1. 更新总播放量
      prisma.songs.update({
        where: { id: songId },
        data: { play_count: { increment: 1 } },
      }),

      // 2. 创建播放记录
      prisma.play_record.create({
        data: {
          song_id: songId,
          played_at: new Date(),
        },
      }),

      // 3. 更新月度统计（UPSERT）
      prisma.song_monthly_stat.upsert({
        where: {
          song_id_year_month: {
            song_id: songId,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          },
        },
        update: { play_count: { increment: 1 } },
        create: {
          song_id: songId,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          play_count: 1,
        },
      }),
    ])

    return res.status(200).json({
      success: true,
      message: '播放量统计成功',
    })
  } catch (error) {
    console.error('播放量统计失败:', error)
    return res.status(500).json({
      success: false,
      message: '播放量统计失败',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    })
  }
}

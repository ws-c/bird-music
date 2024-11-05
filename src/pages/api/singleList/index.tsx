import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const songs = await prisma.songs.findMany({
        distinct: ['artist_id'],
        orderBy: {
          albums: {
            release_date: 'desc', // 按专辑发布日期降序排序
          },
        },
        take: 9, // 只获取最新的9条记录
        include: {
          albums: {
            select: {
              cover: true, // 获取专辑封面
              release_date: true, // 获取专辑发布日期
              title: true, // 获取专辑标题
            },
          },
          artists: {
            select: {
              name: true, // 获取艺术家名字
            },
          },
        },
      })
      res.status(200).json(songs)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch songs' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

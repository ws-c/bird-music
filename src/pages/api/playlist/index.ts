import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const playlist = await prisma.playlist.findMany()
      res.status(200).json(playlist)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch playlist' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

import { put } from '@/lib/oss'
import { IncomingForm } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'

// 配置 API 路由不自动解析请求体
export const config = {
  api: {
    bodyParser: false, // 禁用 Next.js 默认的 bodyParser
  },
}

// 默认导出 API 路由处理函数
export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm()
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    const file = (data as any)?.files?.file // 获取上传的文件
    if (!file) {
      return res.status(400).json({ code: 1, msg: 'No file uploaded' })
    }

    const filePath = `upload_avatar/${Date.now()}-${file[0].originalFilename}` // 拼接上传文件路径
    const resultUrl = await put(filePath, file[0].filepath) // 上传文件到阿里云 OSS

    res.status(200).json({
      code: 0,
      msg: '',
      data: {
        url: resultUrl,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      code: 1,
      msg: 'Server error while processing file upload',
    })
  }
}

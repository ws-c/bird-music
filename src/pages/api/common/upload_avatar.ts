import OSS from 'ali-oss'
import { IncomingForm } from 'formidable'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

// 配置阿里云 OSS 客户端
const client = new OSS({
  region: process.env.NEXT_PUBLIC_OSS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.NEXT_PUBLIC_OSS_BUCKET,
})
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

// 上传文件到阿里云 OSS
async function put(fileName: string, filePath: string) {
  try {
    const result = await client.put(fileName, path.normalize(filePath))
    if (result?.res?.status === 200) {
      return result.url // 返回 OSS 的文件访问 URL
    } else {
      throw new Error('Failed to upload to OSS')
    }
  } catch (error) {
    console.error('Error uploading file to OSS:', error)
    throw error
  }
}

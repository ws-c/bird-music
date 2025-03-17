import OSS from 'ali-oss'
import path from 'path'

// 配置阿里云 OSS 客户端
const client = new OSS({
  region: process.env.NEXT_PUBLIC_OSS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.NEXT_PUBLIC_OSS_BUCKET,
})

// 上传文件到阿里云 OSS
export async function put(fileName: string, filePath: string) {
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

// 图片转换函数
/**
 * 将给定的文件异步转换为 WebP 格式
 * @param file 要转换的文件对象
 * @returns 返回一个 Promise，解析为转换后的 WebP 文件对象
 */
export async function toWebP(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        // 转换为 WebP，设置质量为 0.8（范围 0-1）
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('转换失败'))
            const newFile = new File(
              [blob],
              file.name.replace(/\..+$/, '.webp'),
              { type: 'image/webp' }
            )
            resolve(newFile)
          },
          'image/webp',
          0.8
        )
      }
      img.src = e.target?.result as string
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

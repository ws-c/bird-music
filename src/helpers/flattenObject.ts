export default function flattenObject(obj: any) {
  const result: { [key: string]: any } = {}
  const stack = [{ obj }]

  while (stack.length > 0) {
    const { obj } = stack.pop()!

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // 如果是对象，继续扁平化
          stack.push({ obj: value })
        } else {
          // 如果是基本类型或数组，直接加入结果
          result[key] = value
        }
      }
    }
  }

  return result
}

import { SelectProps } from 'antd'

export const typeOptions: SelectProps['options'] = [
  { label: '电子', value: 1 },
  { label: '民谣', value: 2 },
  { label: '摇滚', value: 3 },
  { label: '流行', value: 4 },
  { label: '古典', value: 5 },
  { label: '说唱', value: 6 },
  { label: '爵士', value: 7 },
  { label: '蓝调', value: 8 },
  { label: '乡村', value: 9 },
  { label: '金属', value: 10 },
  { label: '朋克', value: 11 },
  { label: '雷鬼', value: 12 },
  { label: '拉丁', value: 13 },
  { label: '世界音乐', value: 14 },
  { label: '新世纪', value: 15 },
  { label: '灵魂乐', value: 16 },
  { label: 'R&B', value: 17 },
  { label: 'funk', value: 18 },
  { label: '嘻哈', value: 19 },
  { label: '实验音乐', value: 20 },
  { label: '电影原声', value: 21 },
  { label: '游戏音乐', value: 22 },
  { label: '儿童音乐', value: 23 },
  { label: '节日音乐', value: 24 },
  { label: '舞曲', value: 25 },
  { label: '轻音乐', value: 26 },
  { label: 'K-Pop', value: 27 },
  { label: 'J-Pop', value: 28 },
  { label: '华语流行', value: 29 },
  { label: '粤语流行', value: 30 },
]
export const typeOptionsMap = new Map(
  typeOptions.map((option) => [option.value, option.label])
)

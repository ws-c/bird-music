import { SelectProps } from 'antd'

export const typeOptions: SelectProps['options'] = [
  { value: 1, label: '电子' },
  { value: 2, label: '民谣' },
  { value: 3, label: '说唱' },
  { value: 4, label: '爵士' },
  { value: 5, label: '古典' },
  { value: 6, label: '乡村' },
  { value: 7, label: '金属' },
  { value: 8, label: '朋克' },
  { value: 9, label: '摇滚' },
  { value: 10, label: '华语' },
  { value: 11, label: '英语' },
  { value: 12, label: '日语' },
  { value: 13, label: '韩语' },
  { value: 14, label: '粤语' },
  { value: 15, label: '影视原声' },
  { value: 16, label: '日漫新番' },
  { value: 17, label: '热门翻唱' },
  { value: 18, label: '游戏' },
  { value: 19, label: 'DJ舞曲' },
  { value: 20, label: '情歌' },
]
export const typeOptionsMap = new Map(
  typeOptions.map((option) => [option.value, option.label])
)

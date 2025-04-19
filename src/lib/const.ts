import { SelectProps } from 'antd'

export const typeOptions: SelectProps['options'] = [
  { value: 1, label: '电子' },
  { value: 2, label: '民谣' },
  { value: 3, label: '说唱' },
  { value: 4, label: '爵士' },
  { value: 5, label: '古典' },
  { value: 6, label: '流行' },
  { value: 7, label: '古风' },
  { value: 8, label: '摇滚' },
  { value: 9, label: '纯音乐' },
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

export const categories = {
  genre: [
    {
      value: 1,
      label: '电子',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/1.webp',
    },
    {
      value: 2,
      label: '民谣',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/2.webp',
    },
    {
      value: 3,
      label: '说唱',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/3.webp',
    },
    {
      value: 4,
      label: '爵士',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/4.webp',
    },
    {
      value: 5,
      label: '古典',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/5.webp',
    },
    {
      value: 6,
      label: '流行',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/6.webp',
    },
    {
      value: 7,
      label: '古风',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/7.webp',
    },
    {
      value: 8,
      label: '摇滚',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/8.webp',
    },
    {
      value: 9,
      label: '纯音乐',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/9.webp',
    },
  ],
  language: [
    {
      value: 10,
      label: '华语',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/10.webp',
    },
    {
      value: 11,
      label: '英语',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/11.webp',
    },
    {
      value: 12,
      label: '日语',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/12.webp',
    },
    {
      value: 13,
      label: '韩语',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/13.webp',
    },
    {
      value: 14,
      label: '粤语',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/14.webp',
    },
  ],
  theme: [
    {
      value: 15,
      label: '影视原声',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/15.webp',
    },
    {
      value: 16,
      label: '日漫新番',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/16.webp',
    },
    {
      value: 17,
      label: '热门翻唱',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/17.webp',
    },
    {
      value: 18,
      label: '游戏',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/18.webp',
    },
    {
      value: 19,
      label: 'DJ舞曲',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/19.webp',
    },
    {
      value: 20,
      label: '情歌',
      imageUrl:
        'https://bird-music1.oss-cn-guangzhou.aliyuncs.com/categories/20.webp',
    },
  ],
}

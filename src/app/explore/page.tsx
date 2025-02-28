'use client'
import React, { useState } from 'react'
import Layout from '@/components/layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Play } from 'lucide-react'

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('genre')

  // 分类数据
  const categories = {
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

  return (
    <Layout curActive="explore">
      <div className="flex-1">
        {/* 分类导航 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="space-x-4 bg-gray-50 p-2">
            <TabsTrigger
              value="genre"
              className="px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              风格
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              语言
            </TabsTrigger>

            <TabsTrigger
              value="theme"
              className="px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              主题
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 分类内容 */}
        <div className="relative right-2 mt-4 flex flex-wrap justify-start">
          {categories[activeTab as keyof typeof categories].map(
            (item, index) => (
              <div
                key={index}
                className="group flex flex-none flex-col items-center p-2"
              >
                <Card className="h-52 w-52 cursor-pointer transition-shadow hover:shadow-sm">
                  <CardContent className="relative h-full p-0">
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.label}
                        className="h-full w-full rounded-md object-cover transition-all duration-300 group-hover:scale-110"
                      />

                      <div className="duration-500 absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-all group-hover:opacity-100">
                        <Play className="duration-500 h-12 w-12 translate-y-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform group-hover:translate-y-0" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-2 w-full px-1">
                  <span className="line-clamp-1 block text-left text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  )
}

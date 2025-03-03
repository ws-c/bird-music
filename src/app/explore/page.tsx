'use client'
import React, { useState } from 'react'
import Layout from '@/components/layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Pause, Play } from 'lucide-react'
import useStore from '@/store/useStore'
import { categories } from '@/lib/const'
export default function ExplorePage() {
  const {
    isPlaying,
    currentCategoryId,
    setIsPlaying,
    setSingleList,
    setCurrentId,
    setShowPlayer,
    setCurrentCategoryId,
  } = useStore()
  const [activeTab, setActiveTab] = useState('genre')
  const handlePlay = async (id: number) => {
    // 如果点击的是当前分类，切换播放状态
    if (currentCategoryId === id) {
      setIsPlaying(!isPlaying)
    } else {
      // 加载新分类数据
      const res = await fetch(`/api/explore?id=${id}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.length <= 0) return
      setSingleList(data)
      setCurrentCategoryId(id)
      setCurrentId(data[0].id)
      setShowPlayer(true)
      setIsPlaying(true)
    }
  }
  return (
    <Layout curActive="explore">
      <div className="flex-1">
        {/* 分类导航 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="space-x-3 bg-gray-50">
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
            (item, index) => {
              const isCurrentCategory = currentCategoryId === item.value // 判断当前分类
              const showPause = isCurrentCategory && isPlaying // 显示暂停图标条件
              return (
                <div
                  key={index}
                  className="group flex flex-none flex-col items-center p-2"
                >
                  <Card className="h-52 w-52 cursor-pointer transition-shadow hover:shadow-sm">
                    <CardContent className="relative h-full p-0">
                      <div
                        className="relative h-full w-full overflow-hidden"
                        onClick={() => handlePlay(item.value)}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.label}
                          className="h-full w-full rounded-md object-cover transition-all duration-300 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-all duration-500 group-hover:opacity-100">
                          {/* 根据播放状态切换图标 */}
                          {showPause ? (
                            <Pause className="h-12 w-12 translate-y-2 fill-white text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:translate-y-0" />
                          ) : (
                            <Play className="h-12 w-12 translate-y-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:translate-y-0" />
                          )}
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
            }
          )}
        </div>
      </div>
    </Layout>
  )
}

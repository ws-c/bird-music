'use client'
import React from 'react'
import Layout from '@/components/layout'
import MusicCard from './components/MusicCard'
import Playlist from './components/Playlist'
import SingleList from './components/SingleList'

export default function Home() {
  return (
    <Layout curActive="/">
      <div>
        <h2 className="pb-4 pt-8 text-3xl font-bold">精选推荐</h2>
        <MusicCard />

        <h2 className="pb-4 pt-8 text-3xl font-bold">热门歌单</h2>
        <Playlist></Playlist>

        <h2 className="pb-6 pt-8 text-3xl font-bold">最新单曲</h2>
        <SingleList></SingleList>
      </div>
    </Layout>
  )
}

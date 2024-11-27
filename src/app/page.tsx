'use client'
import React from 'react'
import Layout from '@/components/layout'
import { Typography } from 'antd'
import MusicCard from './components/MusicCard'
import Playlist from './components/Playlist'
import SingleList from './components/SingleList'

export default function Home() {
  return (
    <Layout curActive="/">
      <div>
        <Typography.Title level={4}>精选推荐</Typography.Title>
        <MusicCard />

        <Typography.Title level={4}>热门歌单</Typography.Title>
        <Playlist></Playlist>

        <Typography.Title level={4}>最新单曲</Typography.Title>
        <SingleList></SingleList>
      </div>
    </Layout>
  )
}

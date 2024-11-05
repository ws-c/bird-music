'use client'
import React from 'react'
import Layout from '../components/layout'
import { Divider, Typography } from 'antd'
import MusicCard from '../components/MusicCard'
import Playlist from '../components/Playlist'
import SingleList from '../components/SingleList'

export default function Home() {
  return (
    <Layout curActive="/">
      <div>
        <Typography.Title level={4}>精选推荐</Typography.Title>
        <Divider></Divider>
        <MusicCard />

        <Typography.Title level={4}>热门歌单</Typography.Title>
        <Divider></Divider>
        <Playlist></Playlist>

        <Typography.Title level={4}>最新单曲</Typography.Title>
        <Divider></Divider>
        <SingleList></SingleList>
      </div>
    </Layout>
  )
}

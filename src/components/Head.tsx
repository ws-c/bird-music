'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AutoComplete, Avatar, Button, Dropdown, Flex } from 'antd'
import { LeftOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import styles from './Header.module.css'
import Input from 'antd/es/input/Input'
import { useRouter } from 'next/navigation'
import useStore from '../store/useStore'
type Option = {
  value: string
  label: string
}

export default function Header() {
  const { name, inputValue, setInputValue } = useStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const route = useRouter()
  const logout = async () => {
    localStorage.clear()
    const res = await fetch('/api/logout', { method: 'POST' })
    route.push('/auth')
    console.log('Logout:', res.ok)
  }

  // 用户下拉菜单
  const items = [
    {
      key: '1',
      label: <span>设置</span>,
    },
    {
      key: '2',
      label: <span onClick={logout}>退出</span>,
    },
  ]
  const [options, setOptions] = useState<Option[]>([])

  const handleSearch = async (value: any) => {
    if (!value) {
      setOptions([])
      return
    }
    const data = await fetch(`/api/search?q=${value}`)
    const newOptions = await data.json()
    setOptions(newOptions)
  }

  const handleSelect = (value: string, option: Option) => {
    console.log('Selected:', value)
    if (value) {
      route.push(`/search/${value}`)
    }
    setInputValue(option.label)
  }
  const handleChange = (value: string) => {
    setInputValue(value)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      route.push(`/search/${inputValue}`)
    }
  }
  return (
    <Flex className={styles.header}>
      <Flex align="center" gap={8}>
        <Button
          disabled={isClient && window.location.pathname === '/'}
          icon={<LeftOutlined size={12} />}
          onClick={() => route.back()}
        ></Button>
        <AutoComplete
          allowClear
          style={{ width: '300px' }}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
          value={inputValue}
          onChange={handleChange}
        >
          <Input
            placeholder="搜索"
            prefix={<SearchOutlined />}
            style={{ height: '32px' }}
            onKeyDown={handleKeyDown}
          />
        </AutoComplete>
      </Flex>
      <div className={styles.right}>
        <span>{isClient && name}</span>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Avatar icon={<UserOutlined />} className={styles.avatar} />
        </Dropdown>
      </div>
    </Flex>
  )
}

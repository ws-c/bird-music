'use client'
import React, { useEffect, useState } from 'react'
import {
  AutoComplete,
  Avatar,
  Button,
  Dropdown,
  Flex,
  Input,
  message,
} from 'antd'
import { LeftOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import useStore from '../store/useStore'
import styles from './Header.module.css'
import HeadSetting from './HeadSetting'

type Option = {
  value: string
  label: string
}

export default function Header() {
  const { user, inputValue, setInputValue } = useStore()
  const [isClient, setIsClient] = useState(false)
  const [open, setOpen] = useState(false) // 控制用户设置抽屉
  const [options, setOptions] = useState<Option[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const route = useRouter()

  const logout = async () => {
    localStorage.clear()
    await fetch('/api/logout', { method: 'POST' })
    route.push('/auth')
  }

  const items = [
    {
      key: '1',
      label: <span>设置</span>,
      onClick: () => setOpen(true),
    },
    {
      key: '2',
      label: <span onClick={logout}>退出</span>,
    },
  ]

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
          type="text"
          style={{ position: 'relative', top: '2px', height: '36px' }}
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
            variant="filled"
            placeholder="搜索"
            prefix={<SearchOutlined />}
            style={{ height: '36px' }}
            onKeyDown={handleKeyDown}
          />
        </AutoComplete>
      </Flex>
      <div className={styles.right}>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Avatar
            src={isClient && user.cover}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
        </Dropdown>
        <span>{isClient && user.username}</span>
      </div>
      {/* 引入抽离的用户设置组件 */}
      <HeadSetting open={open} setOpen={setOpen} />
    </Flex>
  )
}

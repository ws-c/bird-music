'use client'
import { useEffect, useState } from 'react'
import { Form, Input, Button, notification, Tabs, Flex } from 'antd'
import useStore from '@/store/useStore'
import Icons from '@/components/Icons'

export default function Auth() {
  const { setShowPlayer, setUser } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTabKey, setActiveTabKey] = useState('1')

  const queryString = window.location.search
  const queryParams = new URLSearchParams(queryString)
  const returnUrl = queryParams.get('returnUrl') || '/' // 默认为首页
  useEffect(() => {
    setShowPlayer(false)
  }, [setShowPlayer])

  const handleLoginSubmit = async (values: {
    username: string
    password: string
  }) => {
    const { username, password } = values
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const resData = await res.json()
    if (resData.code === 200) {
      setUser(resData.data)
      window.location.href = returnUrl
    } else {
      setError(resData.message || '登录失败')
    }
  }

  const handleRegisterSubmit = async (values: {
    username: string
    password: string
  }) => {
    const { username, password } = values
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      notification.success({ message: '注册成功' })
      setActiveTabKey('1')
    } else {
      const data = await res.json()
      setError(data.message || '注册失败')
      notification.error({
        message: '注册失败',
        description: data.message || '请重试',
      })
    }
  }

  const tabsItems = [
    {
      key: '1',
      label: '登录',
      children: (
        <Form
          onFinish={handleLoginSubmit}
          initialValues={{ username, password }}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-6"
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6"
            />
          </Form.Item>
          {error && (
            <p className="mt-2.5 text-center text-sm text-red-500">{error}</p>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="hover:bg-[#4c5ba6]! rounded-lg bg-[#6e7fdb] py-3 text-base text-white transition-colors duration-300"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '注册',
      children: (
        <Form
          onFinish={handleRegisterSubmit}
          initialValues={{ username, password }}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { max: 16, message: '用户名不能超过16个字符' },
            ]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-6"
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6"
            />
          </Form.Item>
          {error && (
            <p className="mt-2.5 text-center text-sm text-red-500">{error}</p>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="hover:bg-[#4c5ba6]! rounded-lg bg-[#6e7fdb] py-3 text-base text-white transition-colors duration-300"
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div className="animate-gradientBG bg-gradient-125 h-screen from-[#e79dad] via-[#ffe3ee] to-[#67baa7] bg-[length:300%]">
      <Flex className="absolute left-4 top-2 h-16 items-baseline">
        <Icons
          type="icon-Twitter_icon4948c882-copy"
          size={24}
          className="mr-2"
        />
        <div className="text-2xl font-semibold">Bird Music</div>
      </Flex>

      <div className="flex h-screen items-center justify-center">
        <div className="animate-fadeIn w-full max-w-[420px] rounded-xl bg-white p-4 shadow-lg">
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            items={tabsItems.map((item) => ({
              ...item,
              children: (
                <>
                  <h2 className="mb-5 text-center text-2xl font-bold text-[#444]">
                    {item.label}
                  </h2>
                  {item.children}
                </>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  )
}

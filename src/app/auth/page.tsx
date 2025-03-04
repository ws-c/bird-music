'use client'
import { useEffect, useState } from 'react'
import { Form, Input, Button, notification, Tabs, Flex } from 'antd'
import useStore from '@/store/useStore'
import Icons from '@/components/Icons'
import { Fetch } from '@/lib/request'

export default function Auth() {
  const { setShowPlayer, setUser } = useStore()
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [returnUrl, setReturnUrl] = useState('/')
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  // 切换选项卡时重置表单
  const handleTabChange = (key: string) => {
    if (key === '1') {
      loginForm.resetFields()
    } else {
      registerForm.resetFields()
    }
    setActiveTabKey(key)
  }

  useEffect(() => {
    const queryString = window.location.search
    const queryParams = new URLSearchParams(queryString)
    setReturnUrl(queryParams.get('returnUrl') || '/')

    setShowPlayer(false)
  }, [setShowPlayer])

  const handleLoginSubmit = async (values: {
    username: string
    password: string
  }) => {
    const { username, password } = values

    const res = await Fetch('/api/login', {
      method: 'POST',
      body: { username, password },
    })

    setUser(res.data)
    window.location.href = returnUrl
  }

  const handleRegisterSubmit = async (values: {
    username: string
    password: string
  }) => {
    const { username, password } = values

    await Fetch('/api/register', {
      method: 'POST',
      body: { username, password },
    })

    notification.success({ message: '注册成功' })
    handleTabChange('1')
  }

  const tabsItems = [
    {
      key: '1',
      label: '登录',
      children: (
        <Form
          onFinish={handleLoginSubmit}
          layout="vertical"
          form={loginForm}
          autoComplete="new-password"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input className="mb-6" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password className="mb-6" />
          </Form.Item>
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
          layout="vertical"
          form={registerForm}
          autoComplete="new-password"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { max: 16, message: '用户名不能超过16个字符' },
            ]}
          >
            <Input className="mb-6" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password className="mb-6" />
          </Form.Item>

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
    <div className="h-screen animate-gradientBG bg-gradient-125 from-[#e79dad] via-[#ffe3ee] to-[#67baa7] bg-[length:300%]">
      <Flex className="absolute left-4 top-2 h-16 items-baseline">
        <Icons
          type="icon-Twitter_icon4948c882-copy"
          size={24}
          className="mr-2"
        />
        <div className="text-2xl font-semibold">Bird Music</div>
      </Flex>

      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-[420px] animate-fadeIn rounded-xl bg-white p-4 shadow-lg">
          <Tabs
            activeKey={activeTabKey}
            onChange={handleTabChange}
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

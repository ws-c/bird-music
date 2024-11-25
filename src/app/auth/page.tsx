'use client'
import { useEffect, useState } from 'react'
import { Form, Input, Button, notification, Tabs, Flex } from 'antd'
import styles from './Auth.module.css'
import useStore from '../../store/useStore'
import Icons from '../../components/Icons'
import Title from 'antd/es/typography/Title'

export default function Auth() {
  const { setShowPlayer, setUser } = useStore()
  useEffect(() => {
    // 停止播放等操作
    setShowPlayer(false)
  }, [])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTabKey, setActiveTabKey] = useState('1') // Track the active tab

  const handleLoginSubmit = async (values: {
    username: any
    password: any
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
      console.log('res', resData.data)
      setUser(resData.data)
      // 强制刷新，消除路由缓存
      window.location.href = '/'
    } else {
      setError(resData.message || '登录 failed')
    }
  }

  const handleRegisterSubmit = async (values: {
    username: any
    password: any
  }) => {
    const { username, password } = values
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      notification.success({
        message: '注册成功',
      })

      // After registration, switch to the "Login" tab
      setActiveTabKey('1')
    } else {
      const data = await res.json()
      setError(data.message || 'Registration failed')
      notification.error({
        message: 'Registration Failed',
        description: data.message || 'Please try again.',
      })
    }
  }

  // Define the tab items
  const tabsItems = [
    {
      key: '1',
      label: '登录',
      children: (
        <>
          <h2 className={styles.tabHeader}>登录</h2>
          <Form
            onFinish={handleLoginSubmit}
            initialValues={{ username, password }}
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.formInput}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
              />
            </Form.Item>
            {error && <p className={styles.errorText}>{error}</p>}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={styles.formButton}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      key: '2',
      label: '注册',
      children: (
        <>
          <h2 className={styles.tabHeader}>注册</h2>
          <Form
            onFinish={handleRegisterSubmit}
            initialValues={{ username, password }}
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { max: 16, message: '用户名长度不能超过16个字符' },
              ]}
            >
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.formInput}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
              />
            </Form.Item>
            {error && <p className={styles.errorText}>{error}</p>}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={styles.formButton}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
  ]

  return (
    <div className={styles.full}>
      <Flex
        style={{
          position: 'absolute',
          alignItems: 'baseline',
          marginLeft: '32px',
          height: '64px',
          marginBottom: '16px',
        }}
      >
        <Icons
          type="icon-a-1f99c"
          size={24}
          style={{
            marginRight: '8px',
          }}
        />
        <Title level={3} style={{ marginBottom: 0, lineHeight: '24px' }}>
          Bird Music
        </Title>
      </Flex>

      <div className={styles.container}>
        <div className={styles.Authcontainer}>
          <Tabs
            activeKey={activeTabKey} // Controlled tab key
            onChange={setActiveTabKey} // Update active key when tab is changed
            style={{ width: '100%' }}
            className={styles.tabs}
            items={tabsItems} // Pass the items array to the Tabs component
          />
        </div>
      </div>
    </div>
  )
}

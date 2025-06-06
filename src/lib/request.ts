import { message } from 'antd'
import NProgress from 'nprogress'
type FetchConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: HeadersInit
  body?: unknown
  responseType?: 'json' | 'text'
  silent?: boolean // 是否静默模式（不显示错误提示）
  loading?: boolean // 是否显示进度条
  next?: any
}

// 全局计数器跟踪活跃请求数
let activeRequests = 0
NProgress.configure({ showSpinner: false })
export const Fetch = async <T = any>(
  url: string,
  {
    method = 'GET',
    body,
    headers = {},
    silent = false,
    responseType = 'json',
    loading = true,
    next,
  }: FetchConfig = {}
): Promise<T> => {
  try {
    if (loading) {
      activeRequests++
      if (activeRequests === 1) NProgress.start()
    }
    const response = await fetch(url, {
      method,
      headers: {
        // 自动为需要 body 的方法添加 JSON 头
        ...(method !== 'GET' && { 'Content-Type': 'application/json' }),
      },
      ...headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      ...next,
    })

    const data =
      responseType === 'text' ? await response.text() : await response.json()

    if (!response.ok) {
      const errorMsg = data?.msg || data?.message || data?.error || '请求失败'
      if (!silent) message.error(errorMsg)
      throw new Error(errorMsg)
    }

    return data
  } catch (error: any) {
    if (!silent) {
      const errorMsg =
        error?.msg || error?.message || error?.error || '网络连接异常'
      message.error(errorMsg)
    }
    throw error
  } finally {
    // 结束进度条：仅当最后一个请求完成时触发
    if (loading) {
      activeRequests--
      if (activeRequests === 0) NProgress.done()
    }
  }
}

import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose' // Import the jwtVerify method from jose

const JWT_SECRET = new TextEncoder().encode('Fizz') // 'Fizz' needs to be encoded into a Uint8Array

export async function middleware(req) {
  const token = req.cookies.get('token')?.value

  // 受保护路径
  const protectedPaths = ['/album'] // 定义需要进行 token 校验的路径
  const isProtectedRoute = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  // 如果访问的是受保护路径，并且没有 token，则重定向到登录页
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // 如果访问的是受保护路径并且有 token，则校验 token
  if (isProtectedRoute && token) {
    try {
      // jwtVerify returns a promise, so we need to await it
      const { payload } = await jwtVerify(token, JWT_SECRET)
      console.log('Decoded payload:', payload)
    } catch (err) {
      console.log('Token is invalid or expired', err)
      // 如果 token 无效或过期，则重定向到登录页
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }
  // 对于不需要 token 的路径，直接放行
  return NextResponse.next()
}

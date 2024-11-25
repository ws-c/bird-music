import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose' // Import the jwtVerify method from jose

const JWT_SECRET = new TextEncoder().encode('Fizz') // 'Fizz' needs to be encoded into a Uint8Array

export async function middleware(req: {
  cookies: { get: (arg0: string) => { (): any; new (): any; value: any } }
  nextUrl: { pathname: string }
  url: string | URL | undefined
}) {
  const token = req.cookies.get('token')?.value

  // 需要进行 token 校验的受保护路径
  const protectedPaths = ['/album', '/search', '/playlist', '/artist', '/radio']
  const isProtectedRoute = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  // 如果访问的是受保护路径且没有 token，则重定向到登录页（/auth）
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // 如果有 token，校验 token 是否有效
  if (token) {
    try {
      // 校验 token
      const { payload } = await jwtVerify(token, JWT_SECRET)
      console.log('Decoded payload:', payload)

      // 如果 token 有效，允许访问受保护路径
      return NextResponse.next()
    } catch (err) {
      console.log('Token is invalid or expired', err)
      // 如果 token 无效或过期，重定向到登录页（/auth）
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }

  // 对于不需要 token 的路径，直接放行
  return NextResponse.next()
}

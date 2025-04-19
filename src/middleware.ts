import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode('Fizz')

export async function middleware(req: {
  cookies: { get: (arg0: string) => { (): any; new (): any; value: any } }
  nextUrl: { pathname: string }
  url: string
}) {
  const token = req.cookies.get('token')?.value

  // 受保护的路由列表
  const protectedPaths = [
    '/album',
    '/search',
    '/playlist',
    '/artist',
    '/explore',
    '/love',
    'recent',
  ]

  // 如果是受保护路由且无 Token → 重定向到登录页
  if (
    protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path)) &&
    !token
  ) {
    return NextResponse.redirect(
      new URL(`/auth?returnUrl=${encodeURIComponent(req.url)}`, req.url)
    )
  }

  // 如果有 Token → 校验有效性
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (err) {
      console.error('Token verification failed:', err)

      // 删除 Token 并重定向
      const res = NextResponse.redirect(
        new URL(`/auth?returnUrl=${encodeURIComponent(req.url)}`, req.url)
      )
      res.cookies.set('token', '', {
        maxAge: -99999999,
        path: '/',
        httpOnly: true,
      })
      return res
    }
  }

  // 其他路由直接放行
  return NextResponse.next()
}

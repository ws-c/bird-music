import Layout from '../../../components/layout'

export default function Page({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string } // 获取动态参数 id
}) {
  return <Layout curActive={`playlist/${params.id}`}>{children}</Layout>
}

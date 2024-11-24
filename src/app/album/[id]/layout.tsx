import Layout from '../../../components/layout'

export default function Page({ children }: { children: React.ReactNode }) {
  return <Layout curActive={''}>{children}</Layout>
}

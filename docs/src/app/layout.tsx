import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  title: {
    template: '%s - Sygnal Devmode',
    default: 'Sygnal Devmode Documentation'
  },
  description:
    'Official documentation for Sygnal Devmode, the Chrome extension that rewrites script and stylesheet sources per environment.'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const navbar = <Navbar logo={<strong>Sygnal Devmode</strong>} />
  const pageMap = await getPageMap()

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout
          navbar={navbar}
          footer={
            <Footer>
              &copy; {new Date().getFullYear()} Sygnal &middot; Sygnal Devmode Documentation
            </Footer>
          }
          editLink="Suggest edits on GitHub"
          docsRepositoryBase="https://github.com/sygnaltech/devmode-docs"
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: true }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

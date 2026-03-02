import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  title: {
    template: '%s - Sygnal Components',
    default: 'Sygnal Components Documentation'
  },
  description:
    'Official documentation for Sygnal Components, a reusable UI component library for Webflow.'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const navbar = <Navbar logo={<strong>Sygnal Components</strong>} />
  const pageMap = await getPageMap()

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout
          navbar={navbar}
          footer={
            <Footer>
              &copy; {new Date().getFullYear()} Sygnal &middot; Sygnal Components Documentation
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

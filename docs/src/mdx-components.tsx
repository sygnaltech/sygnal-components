import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'
import { Callout } from './components/Callout'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    ...docsComponents,
    Callout,
    ...components
  }
}

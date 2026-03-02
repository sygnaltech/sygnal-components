# My Nextra 4 Documentation

A clean documentation site built with Nextra 4 and Next.js 15.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
my-docs-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   └── [[...slug]]/
│   │       ├── layout.tsx          # Docs layout with Nextra theme
│   │       └── page.tsx            # Dynamic page handler
│   └── content/                    # Your MDX documentation files
│       ├── _meta.json              # Sidebar configuration
│       ├── index.mdx               # Home page
│       ├── basic-features.mdx
│       ├── advanced-features.mdx
│       └── components.mdx
├── next.config.mjs                 # Next.js + Nextra config
├── package.json
└── tsconfig.json
```

## Adding New Pages

1. Create a new `.mdx` file in `src/content/`
2. Add frontmatter with title and description
3. Update `src/content/_meta.json` to add it to the sidebar

Example:

```mdx
---
title: My New Page
description: Description of my page
---

# My New Page

Your content here...
```

## Features Demonstrated

This starter includes examples of:

- ✅ Basic Markdown syntax
- ✅ Code blocks with syntax highlighting
- ✅ Callouts (info, warning, error)
- ✅ Steps component
- ✅ Tabs component
- ✅ Cards component
- ✅ FileTree component
- ✅ Math equations (LaTeX)
- ✅ Mermaid diagrams
- ✅ Dark mode
- ✅ Full-text search

## Learn More

- [Nextra Documentation](https://nextra.site)
- [Next.js Documentation](https://nextjs.org/docs)

## Deploy

Deploy easily to Vercel:

```bash
npm run build
```

Or use Vercel CLI:

```bash
vercel
```




# Nextra reference 

Important, the nextra monorepo is available locally here-

d:\Projects\Docs\Nextra

And the docs example is at- 

d:\Projects\Docs\Nextra\examples\docs 


# Images

Place in /public

## How to Use Images in MDX

Once your images are in the public folder, you have two options:

Option 1: Simple Markdown Syntax (Recommended)

```
![Alt text](/image.png)
```

This works because Nextra has staticImage: true enabled by default, which automatically optimizes images using Next.js Image.

Option 2: Next.js Image Component (More Control)

import Image from 'next/image'

```
<Image src="/image.png" alt="Description" width={500} height={500} /> 
```


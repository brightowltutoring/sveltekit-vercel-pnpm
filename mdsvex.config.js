import { defineMDSveXConfig as defineConfig } from "mdsvex";
import remarkMath from 'remark-math'
import rehypeKatexSvelte from "rehype-katex-svelte";

const config = defineConfig({
  extensions: [".svelte.md", ".md", ".svx"],

  smartypants: {
    dashes: "oldschool",
  },

  remarkPlugins: [remarkMath],
  rehypePlugins: [
    rehypeKatexSvelte,
    {
      macros: {
        "\\CC": "\\mathbb{C}",
        "\\vec": "\\mathbf",
      },
    },
  ],
  
});

export default config;

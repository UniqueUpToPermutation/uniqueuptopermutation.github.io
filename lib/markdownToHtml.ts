import { remark } from "remark";
import html from "remark-html";
import remarkMdx from 'remark-mdx'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
  .use(html)
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeMathjax)
  .use(rehypeStringify)
  .process(markdown); 
  return result.toString();
}

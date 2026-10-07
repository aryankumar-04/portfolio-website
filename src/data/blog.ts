import { BlogPost } from '../types/cms';
import { articles } from './articles.js';

export const blogPosts: BlogPost[] = articles.map((art: any, index: number) => ({
  id: `blog-post-${index + 1}`,
  slug: art.slug,
  title: art.title,
  subheading: art.summary,
  summary: art.summary,
  excerpt: art.cardDescription,
  coverImage: typeof art.cover === 'string' ? art.cover : (art.cover as any)?.src || art.cover,
  cover: art.cover,
  cardImage: art.cardImage,
  cardDescription: art.cardDescription,
  publishedDate: art.date,
  date: art.date,
  blocks: art.blocks,
  aliases: art.aliases,
  bodyHtml: (art.blocks || [])
    .map((b: any) => {
      if (b.type === 'heading') return `<h2>${b.text}</h2>`;
      if (b.type === 'paragraph') return `<p>${b.text}</p>`;
      if (b.type === 'list') return `<ul>${b.items.map((it: string) => `<li>${it}</li>`).join('')}</ul>`;
      return '';
    })
    .join(''),
}));

export default blogPosts;

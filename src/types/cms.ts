export type WorkSection =
  | { type: 'text'; heading: string; paragraphs: string[] }
  | { type: 'gallery'; images: [string, string] }
  | { type: 'collage'; image: string };

export interface WorkItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  year: string;
  liveLink: string;
  githubUrl?: string;
  images: {
    hero: string;
    detail1: string;
    detail2: string;
    detail3: string;
  };
  introHtml: string;
  bodyHtml: string;
  outroHtml: string;
  sections: WorkSection[];
}

export type ArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string; links?: { text: string; url: string }[] }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subheading: string;
  excerpt: string;
  coverImage: string;
  readTime?: string;
  bodyHtml: string;
  publishedDate?: string;
  cardImage?: string;
  cardDescription?: string;
  summary?: string;
  date?: string;
  cover?: string;
  blocks?: ArticleBlock[];
  aliases?: string[];
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
}

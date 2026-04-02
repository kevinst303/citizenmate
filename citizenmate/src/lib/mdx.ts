import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the root for all blog content
const root = process.cwd();
const BLOG_DIR = path.join(root, 'src', 'content', 'blog');

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  description: string;
  image?: string;
  category?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR);
  // Extract just the filename without extension
  return files.filter(file => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse frontmatter
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as BlogPostFrontmatter,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.frontmatter.date > post2.frontmatter.date ? -1 : 1));

  return posts;
}

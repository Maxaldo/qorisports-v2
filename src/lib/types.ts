export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: Category;
  author: Author;
  publishedAt: string;
  readingTime: number;
  views: number;
  featured: boolean;
  tags: string[];
}

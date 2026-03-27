export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  count?: number;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  league: string;
  status: "upcoming" | "live" | "finished";
  homeScore: number | null;
  awayScore: number | null;
  matchday: number;
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

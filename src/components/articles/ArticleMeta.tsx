import Image from "next/image";
import { formatDate } from "@/lib/api";
import type { Author } from "@/lib/types";

interface ArticleMetaProps {
  author: Author;
  publishedAt: string;
  readingTime: number;
}

// Bandeau d'informations : avatar, nom, date et temps de lecture.
export function ArticleMeta({
  author,
  publishedAt,
  readingTime,
}: ArticleMetaProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-text-secondary">
      <Image
        src={author.avatar}
        alt={author.name}
        width={32}
        height={32}
        className="rounded-full"
      />
      <span className="font-medium">{author.name}</span>
      <span className="h-1 w-1 rounded-full bg-text-secondary/40" />
      <span>{formatDate(publishedAt)}</span>
      <span className="h-1 w-1 rounded-full bg-text-secondary/40" />
      <span>{readingTime} min de lecture</span>
    </div>
  );
}

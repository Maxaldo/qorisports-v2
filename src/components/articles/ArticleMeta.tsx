import Image from "next/image";
import { Eye } from "lucide-react";
import { formatDate, formatViews } from "@/lib/api";
import type { Author } from "@/lib/types";

interface ArticleMetaProps {
  author: Author;
  publishedAt: string;
  readingTime: number;
  views: number;
}

export function ArticleMeta({
  author,
  publishedAt,
  readingTime,
  views,
}: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary dark:text-gray-400">
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
      <span className="h-1 w-1 rounded-full bg-text-secondary/40" />
      <span className="flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" />
        {formatViews(views)} vues
      </span>
    </div>
  );
}

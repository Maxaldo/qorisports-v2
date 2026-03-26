import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleMeta } from "@/components/articles/ArticleMeta";
import { ShareButtons } from "@/components/articles/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import {
  getArticleBySlug,
  getArticles,
  getArticlesByCategory,
} from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article non trouve" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getArticlesByCategory(article.category.slug)
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-text-secondary dark:text-gray-400">
          <Link href="/" className="transition-colors hover:text-accent">
            Accueil
          </Link>
          <span>/</span>
          <Link
            href={`/categorie/${article.category.slug}`}
            className="transition-colors hover:text-accent"
          >
            {article.category.name}
          </Link>
          <span>/</span>
          <span className="text-text-primary line-clamp-1 dark:text-gray-100">
            {article.title}
          </span>
        </nav>

        <Badge label={article.category.name} color={article.category.color} />

        <h1 className="mt-4 text-3xl font-display font-bold leading-tight text-text-primary md:text-4xl dark:text-gray-100">
          {article.title}
        </h1>

        <div className="mt-5">
          <ArticleMeta
            author={article.author}
            publishedAt={article.publishedAt}
            readingTime={article.readingTime}
          />
        </div>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div
          className="prose prose-lg mt-10 max-w-none prose-p:text-text-secondary prose-p:leading-relaxed dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-10">
          <ShareButtons
            url={`/article/${article.slug}`}
            title={article.title}
          />
        </div>

        <hr className="mt-10 border-gray-200 dark:border-gray-800" />
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-10">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary md:text-2xl dark:text-gray-100">
            Articles similaires
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <ArticleCard key={a.id} article={a} variant="large" index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

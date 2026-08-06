import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { ArticleMeta } from "@/components/articles/ArticleMeta";
import { ReadingProgress } from "@/components/articles/ReadingProgress";
import { ViewTracker } from "@/components/articles/ViewTracker";
import { ShareButtons } from "@/components/articles/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppCta } from "@/components/whatsapp/WhatsAppCta";
import { ArticleAd } from "@/components/articles/ArticleAd";
import {
  getActiveAd,
  getArticleBySlug,
  getArticles,
  getBadgeLabel,
  getArticlesByCategory,
  getLatestArticles,
} from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 24 h : un article publie ne change quasiment plus. Les modifications sont
// poussees immediatement par le dashboard via /api/revalidate.
export const revalidate = 86400;

// Tous les articles existants sont generes au build : les robots qui testent
// des URLs au hasard ne declenchent plus la creation de pages en cache.
// dynamicParams reste actif pour que les nouveaux articles publies depuis le
// dashboard soient accessibles immediatement, sans redeploiement.
export async function generateStaticParams() {
  try {
    const { articles } = await getArticles(1, 1000);
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article non trouve" };
  const url = `https://www.qorisports.com/article/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [{ url: article.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [{ articles: categoryArticles }, latest, articleAd] = await Promise.all([
    getArticlesByCategory(article.category.slug),
    getLatestArticles(20),
    getActiveAd("article"),
  ]);
  const related = categoryArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  // Suggestions d'AUTRES categories (les plus recents, hors categorie actuelle)
  const discover = latest
    .filter(
      (a) => a.id !== article.id && a.category.slug !== article.category.slug,
    )
    .slice(0, 3);

  // Donnees structurees Schema.org : aident Google a comprendre l'article
  // (resultats enrichis, Google Actualites, Discover).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedAt,
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: "Qorisports",
      url: "https://www.qorisports.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.qorisports.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.qorisports.com/article/${article.slug}`,
    },
    articleSection: article.category.name,
    inLanguage: "fr",
  };

  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker slug={article.slug} />
      <ReadingProgress />

      <div id="article-body" className="mx-auto max-w-4xl px-4 pt-8">
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

        <Badge label={getBadgeLabel(article)} color={article.category.color} />

        <h1 className="mt-4 text-3xl font-display font-bold leading-tight text-text-primary md:text-4xl dark:text-gray-100">
          {article.title}
        </h1>

        <div className="mt-5">
          <ArticleMeta
            author={article.author}
            publishedAt={article.publishedAt}
            readingTime={article.readingTime}
            views={article.views}
          />
        </div>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover object-top"
          />
        </div>

        <ArticleContent html={article.content} />

        <ArticleAd ad={articleAd} />

        <div className="mt-10">
          <ShareButtons
            url={`/article/${article.slug}`}
            title={article.title}
          />
        </div>

        <WhatsAppCta />

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

      {discover.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary md:text-2xl dark:text-gray-100">
            À découvrir aussi
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {discover.map((a, i) => (
              <ArticleCard key={a.id} article={a} variant="large" index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

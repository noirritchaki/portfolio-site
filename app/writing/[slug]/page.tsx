import { notFound } from "next/navigation";
import Article from "@/components/Article";
import { articles, findEntry } from "@/content/entries";
import { profile } from "@/content/profile";

export function generateStaticParams() {
  return articles.map((entry) => ({ slug: entry.slug! }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const entry = findEntry(slug);

  return {
    title: entry ? `${entry.title} — ${profile.name}` : profile.name,
  };
}

export default async function WritingPage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const entry = findEntry(slug);

  if (!entry) notFound();

  return <Article entry={entry} />;
}

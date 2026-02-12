import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WorkDetailPage from '../../../../../components/next/WorkDetailPage';
import { getAllWorkSlugs, getWorkBySlug, getWorkCoverUrl } from '../../../../../lib/works';
import { getAlternates, toAbsoluteUrl } from '../../../../../lib/seo';

interface WorkDetailRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WorkDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug, 'en');

  if (!work) {
    return {
      title: 'Work not found',
      description: 'The requested work could not be found.',
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const basePath = `/works/${slug}`;
  const localizedPath = `/en/works/${slug}`;
  const image = getWorkCoverUrl(work.cover, work.category);

  return {
    title: `${work.title} | Hwang Gyeongha`,
    description: work.shortDescription || work.description,
    alternates: getAlternates(basePath, 'en'),
    openGraph: {
      title: work.title,
      description: work.shortDescription || work.description,
      url: toAbsoluteUrl(localizedPath),
      type: 'article',
      locale: 'en_US',
      images: [{ url: image, alt: work.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: work.title,
      description: work.shortDescription || work.description,
      images: [image]
    }
  };
}

const WorkDetailRoute = async ({ params }: WorkDetailRouteProps) => {
  const { slug } = await params;
  const work = getWorkBySlug(slug, 'en');

  if (!work) {
    notFound();
  }

  return <WorkDetailPage work={work} locale="en" />;
};

export default WorkDetailRoute;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WorkDetailPage from '../../../../components/next/WorkDetailPage';
import { getAllWorkSlugs, getWorkBySlug, getWorkCoverUrl } from '../../../../lib/works';
import { getAlternates, toAbsoluteUrl } from '../../../../lib/seo';

interface WorkDetailRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WorkDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug, 'ko');

  if (!work) {
    return {
      title: '작품을 찾을 수 없습니다',
      description: '요청하신 작품 정보를 찾을 수 없습니다.',
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const path = `/works/${slug}`;
  const image = getWorkCoverUrl(work.cover, work.category);

  return {
    title: work.title,
    description: work.shortDescription || work.description,
    alternates: getAlternates(path, 'ko'),
    openGraph: {
      title: work.title,
      description: work.shortDescription || work.description,
      url: toAbsoluteUrl(path),
      type: 'article',
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
  const work = getWorkBySlug(slug, 'ko');

  if (!work) {
    notFound();
  }

  return <WorkDetailPage work={work} locale="ko" />;
};

export default WorkDetailRoute;

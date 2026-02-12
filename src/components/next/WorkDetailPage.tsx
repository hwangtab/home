import Link from 'next/link';
import { WorkCategory } from '../../types/data.types';
import { SupportedLocale, withLocalePrefix } from '../../utils/localePath';
import { WorkDetail, getWorkCoverUrl } from '../../lib/works';

interface WorkDetailPageProps {
  work: WorkDetail;
  locale: SupportedLocale;
}

const CATEGORY_LABELS: Record<SupportedLocale, Record<WorkCategory, string>> = {
  ko: {
    music: '음악',
    visual: '영상',
    writing: '글쓰기',
    performance: '공연',
    struggle: '투쟁'
  },
  en: {
    music: 'Music',
    visual: 'Visual',
    writing: 'Writing',
    performance: 'Performance',
    struggle: 'Struggle'
  }
};

const DETAIL_TEXT = {
  ko: {
    listLink: '작품 목록',
    year: '연도',
    type: '유형',
    category: '카테고리',
    description: '설명',
    tags: '태그',
    action: '관련 링크'
  },
  en: {
    listLink: 'Works',
    year: 'Year',
    type: 'Type',
    category: 'Category',
    description: 'Description',
    tags: 'Tags',
    action: 'Related Link'
  }
};

const WorkDetailPage = ({ work, locale }: WorkDetailPageProps) => {
  const text = DETAIL_TEXT[locale];
  const categoryLabel = CATEGORY_LABELS[locale][work.category];
  const worksPath = withLocalePrefix('/works', locale);
  const coverUrl = getWorkCoverUrl(work.cover, work.category);

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href={worksPath} className="hover:text-brand-primary-300 transition-colors">
            {text.listLink}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{work.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-santokki mb-4">{work.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-300">
            <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700">{text.year}: {work.year}</span>
            {work.type && <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700">{text.type}: {work.type}</span>}
            <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700">{text.category}: {categoryLabel}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <img
              src={coverUrl}
              alt={work.title}
              className="w-full rounded-2xl border border-gray-700 object-cover"
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <section>
              <h2 className="text-xl font-semibold font-santokki mb-3">{text.description}</h2>
              <p className="text-gray-200 leading-8 whitespace-pre-line">{work.description}</p>
            </section>

            {work.primaryAction?.url && (
              <section>
                <h2 className="text-xl font-semibold font-santokki mb-3">{text.action}</h2>
                <a
                  href={work.primaryAction.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 rounded-lg bg-brand-primary-600 hover:bg-brand-primary-500 text-white transition-colors"
                >
                  {work.primaryAction.label}
                </a>
              </section>
            )}

            {!!work.tags?.length && (
              <section>
                <h2 className="text-xl font-semibold font-santokki mb-3">{text.tags}</h2>
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-gray-800 border border-gray-700 text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default WorkDetailPage;

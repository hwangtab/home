import Link from 'next/link';

interface LocalizedNotFoundProps {
  title: string;
  description: string;
  homeLabel: string;
  homeHref: string;
}

const LocalizedNotFound = ({ title, description, homeLabel, homeHref }: LocalizedNotFoundProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="text-7xl font-bold text-brand-primary-500 font-santokki">404</div>
        <h1 className="text-2xl font-bold text-white font-santokki">{title}</h1>
        <p className="text-gray-300 font-wanted-sans">{description}</p>
        <Link
          href={homeHref}
          className="inline-block px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-wanted-sans"
        >
          {homeLabel}
        </Link>
      </div>
    </div>
  );
};

export default LocalizedNotFound;

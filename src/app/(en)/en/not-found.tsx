import LocalizedNotFound from '../../../components/next/LocalizedNotFound';

export default function EnglishNotFound() {
  return (
    <LocalizedNotFound
      title="Page Not Found"
      description="The page you requested does not exist or may have moved."
      homeLabel="Back to Home"
      homeHref="/en"
    />
  );
}

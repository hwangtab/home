import LocalizedNotFound from '../../components/next/LocalizedNotFound';

export default function KoreanNotFound() {
  return (
    <LocalizedNotFound
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 없거나 주소가 바뀌었을 수 있습니다."
      homeLabel="홈으로 돌아가기"
      homeHref="/"
    />
  );
}

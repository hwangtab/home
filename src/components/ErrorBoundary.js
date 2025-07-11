import React from 'react';
import Button from './ui/Button';
import { Container, Stack } from './ui/Layout';
import { Heading2, BodyText } from './ui/Typography';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수 있습니다.
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 직접 만든 폴백 UI를 렌더링할 수 있습니다.
      return (
        <Container size="sm" className="text-center py-20">
          <Stack spacing="lg">
            <Heading2 color="primary">오おっと、問題が発生しました。</Heading2>
            <BodyText color="secondary">
              페이지를 로드하는 중 예기치 않은 오류가 발생했습니다.
            </BodyText>
            <BodyText color="muted" size="sm">
              {this.state.error?.toString()}
            </BodyText>
            <Button 
              onClick={this.handleReload}
              variant="primary"
              size="lg"
              animation="bounce"
            >
              페이지 새로고침
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

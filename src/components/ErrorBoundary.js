import React from 'react';
import Button from './ui/Button';
import { Container, Stack } from './ui/Layout';
import { Heading2, BodyText } from './ui/Typography';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      isChunkError: false,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // 청크 로딩 오류인지 확인
    const isChunkError = error?.name === 'ChunkLoadError' || 
                        error?.message?.includes('Loading chunk') ||
                        error?.message?.includes('Loading CSS chunk');
    
    return { 
      hasError: true, 
      error, 
      isChunkError,
      retryCount: 0 
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    
    // 청크 로딩 오류인 경우 자동 재시도
    if (this.state.isChunkError && this.state.retryCount < 2) {
      setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          error: null,
          retryCount: prevState.retryCount + 1
        }));
      }, 1000);
    }
  }

  handleReload = () => {
    // 캐시 클리어 후 새로고침
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      }).finally(() => {
        window.location.reload(true);
      });
    } else {
      window.location.reload(true);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: this.state.retryCount + 1
    });
  };

  render() {
    if (this.state.hasError) {
      // 청크 로딩 오류에 특화된 UI
      if (this.state.isChunkError) {
        return (
          <Container size="sm" className="text-center py-20">
            <Stack spacing="lg">
              <div className="text-6xl mb-4">🔄</div>
              <Heading2 color="primary">페이지 로딩 중 문제가 발생했습니다</Heading2>
              <BodyText color="secondary">
                새로운 업데이트가 있을 수 있습니다. 페이지를 새로고침해 주세요.
              </BodyText>
              {this.state.retryCount > 0 && (
                <BodyText color="muted" size="sm">
                  재시도 횟수: {this.state.retryCount}/3
                </BodyText>
              )}
              <div className="flex gap-4 justify-center">
                {this.state.retryCount < 3 && (
                  <Button 
                    onClick={this.handleRetry}
                    variant="secondary"
                    size="lg"
                  >
                    다시 시도
                  </Button>
                )}
                <Button 
                  onClick={this.handleReload}
                  variant="primary"
                  size="lg"
                  animation="bounce"
                >
                  새로고침
                </Button>
              </div>
            </Stack>
          </Container>
        );
      }

      // 일반적인 오류 UI
      return (
        <Container size="sm" className="text-center py-20">
          <Stack spacing="lg">
            <div className="text-6xl mb-4">⚠️</div>
            <Heading2 color="primary">예기치 않은 오류가 발생했습니다</Heading2>
            <BodyText color="secondary">
              페이지를 로드하는 중 문제가 발생했습니다.
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

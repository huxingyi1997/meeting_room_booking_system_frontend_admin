import React, { ErrorInfo, ReactNode } from 'react';

import { feReportApiInterface } from '@/api';

interface State {
  hasError: boolean;
}

interface Props {
  moduleName?: string;
  children?: ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    // 更新 state，下次渲染可以展示错误相关的 UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const info = {
      error: JSON.stringify(error),
      error_info: errorInfo.componentStack || 'refer to error',
    };
    const body = JSON.stringify(info);
    const path: string = `/api/v1/fe-report/error`;
    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
    (navigator.sendBeacon &&
      navigator.sendBeacon(path, new Blob([body], { type: 'application/json; charset=UTF-8' }))) ||
      feReportApiInterface.feReportControllerError(info);
  }

  render() {
    const hasError = this.state?.hasError;
    const { children, moduleName = 'App' } = this.props;
    if (hasError) {
      // 渲染出错时的 UI
      return <h1>{moduleName} has an error</h1>;
    }
    return children;
  }
}

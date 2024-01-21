import { onCLS, onFID, onLCP, Metric } from 'web-vitals';

import { feReportApiInterface } from '@/api';
import { PerformanceDto } from '@/api/autogen';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify(metric);
  const path: string = `/api/v1/fe-report/performance`;
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon(path, new Blob([body], { type: 'application/json; charset=UTF-8' }))) ||
    feReportApiInterface.feReportControllerPerformance(metric as PerformanceDto);
}

const makeSample = (n: number): boolean => {
  const guess = Math.floor(Math.random() * n);
  if (guess === 0) {
    return true;
  } else {
    return false;
  }
};

export const reportWebVitals = (n: number = 10) => {
  if (makeSample(n)) {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onLCP(sendToAnalytics);
  }
};

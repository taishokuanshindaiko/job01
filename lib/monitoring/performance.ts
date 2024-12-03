import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';
import { log } from './logger';

export function reportWebVitals() {
  getCLS((metric) => {
    log.info('CLS metric', { name: metric.name, value: metric.value });
  });

  getFID((metric) => {
    log.info('FID metric', { name: metric.name, value: metric.value });
  });

  getLCP((metric) => {
    log.info('LCP metric', { name: metric.name, value: metric.value });
  });

  getFCP((metric) => {
    log.info('FCP metric', { name: metric.name, value: metric.value });
  });

  getTTFB((metric) => {
    log.info('TTFB metric', { name: metric.name, value: metric.value });
  });
}
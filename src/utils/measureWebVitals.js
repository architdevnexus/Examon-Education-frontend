import { onCLS, onINP, onLCP } from 'web-vitals';

export function initWebVitalsLogger() {
  const logVital = (metric) => {
    console.log(`${metric.name}: ${metric.value.toFixed(2)}`);
    
    // Optionally send to backend
    fetch("/metrics/webvitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  };

  onLCP(logVital);
  onCLS(logVital);
  onINP(logVital);
}

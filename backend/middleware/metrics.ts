import promClient from 'prom-client'

const collectDefaultMetrics = promClient.collectDefaultMetrics
collectDefaultMetrics({ timeout: 5000 })

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
})

export { promClient, httpRequestDurationMicroseconds }


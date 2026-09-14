# Monitoring configuration.
#
# Placeholder for:
#   - Prometheus scrape config (services/api/node_api metrics endpoint)
#   - Grafana dashboards (infrastructure/monitoring/dashboards/)
#   - Loki/promtail log aggregation
#
# Prometheus auto-discovery is typically provided by docker-compose
# network labels. Metrics endpoint: http://api:3000/metrics (when enabled).

global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "api"
    static_configs:
      - targets: ["api:3000"]
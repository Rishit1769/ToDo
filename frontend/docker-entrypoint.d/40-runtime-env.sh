#!/bin/sh
set -eu

# Runtime config injection for CRA static build.
# Use APP_API_BASE_URL in compose/env to control API endpoint without rebuilding.
API_BASE_URL="${APP_API_BASE_URL:-http://localhost:5000}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL}"
};
EOF

echo "Runtime config generated with API_BASE_URL=${API_BASE_URL}"

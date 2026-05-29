# Use Node 18 LTS on Alpine Linux
# Alpine is minimal — keeps the image small and reduces attack surface
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first
# Docker caches layers — copying package.json before source code means
# npm install only re-runs when dependencies change, not on every code change
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source code
COPY src/ ./src/

# Run as non-root user for security
# Never run containers as root in production
USER node

# Expose the port the app runs on
EXPOSE 3001

# Health check — Docker will monitor container health
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "src/index.js"]
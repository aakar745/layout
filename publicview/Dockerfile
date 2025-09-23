FROM node:22-alpine AS build

WORKDIR /app

# Copy publicview package files
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY next.config.js ./
COPY postcss.config.mjs ./
COPY components.json ./
COPY eslint.config.mjs ./

# Install dependencies
RUN npm ci --only=production=false

# Copy publicview source code
COPY src ./src
COPY public ./public

# Build Next.js app
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package.json and install production dependencies only
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built Next.js app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Expose publicview port
EXPOSE 3000

# Start Next.js production server
CMD ["node", "server.js"]

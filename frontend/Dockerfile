FROM node:22-alpine AS build

WORKDIR /app

# Copy frontend package files
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY src ./src
COPY index.html ./

# Build frontend
RUN npm run build

# Production stage - Use Node.js to serve (not nginx, keeping it simple)
FROM node:22-alpine

WORKDIR /app

# Install serve package for serving static files
RUN npm install -g serve

# Copy built frontend
COPY --from=build /app/dist ./dist

# Expose frontend port
EXPOSE 3000

# Serve the built React app with SPA routing support
CMD ["serve", "-s", "dist", "-l", "3000"]

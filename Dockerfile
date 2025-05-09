FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build both frontend and backend
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install Puppeteer dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files
COPY --from=build /app/package.json ./
COPY --from=build /app/backend/package.json ./backend/

# Copy built assets
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/frontend/dist ./frontend/dist

# Copy invoice template files
COPY --from=build /app/backend/invoice-template.html /app/backend/
COPY --from=build /app/backend/invoice-styles.css /app/backend/

# Install only production dependencies
RUN cd backend && npm install --only=production

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"] 
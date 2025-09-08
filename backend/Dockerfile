FROM node:22-alpine AS build

WORKDIR /app

# Copy backend package files
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY src ./src

# Build backend
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install Puppeteer dependencies (critical for PDF generation)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Set Puppeteer environment variables (preserve existing config)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_DISABLE_SETUID_SANDBOX=true \
    PUPPETEER_NO_SANDBOX=true

# Copy package.json and install production dependencies
COPY package.json ./
RUN npm install --only=production

# Copy built backend
COPY --from=build /app/dist ./dist

# Copy all template files (preserve existing functionality)
COPY invoice-template.html ./
COPY invoice-styles.css ./
COPY letter-template.html ./
COPY letter-styles.css ./
COPY transport-template.html ./
COPY stand-possession-template.html ./

# Create necessary directories (preserve existing structure)
RUN mkdir -p uploads/exhibitions uploads/exhibitors uploads/fixtures uploads/logos uploads/misc uploads/service-charges uploads/sponsors
RUN mkdir -p receipts
RUN mkdir -p pdf-cache
RUN mkdir -p temp

# Expose backend port
EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

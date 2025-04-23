FROM node:18-alpine as build

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
FROM node:18-alpine

WORKDIR /app

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
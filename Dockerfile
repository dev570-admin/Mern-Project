FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Copy backend source
COPY backend ./backend/

# Install dependencies
WORKDIR /app/backend
RUN npm install --production

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["node", "index.js"]

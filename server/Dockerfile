FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S express -u 1001

# Change ownership
RUN chown -R express:nodejs /app
USER express

EXPOSE 5000

CMD ["npm", "start"]
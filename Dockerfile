# Base image: Node.js (use an appropriate version)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port on which Next.js runs
EXPOSE 3000

# Set environment variable for production mode
ENV NODE_ENV=production

# Start the Next.js server
CMD ["npm", "start"]


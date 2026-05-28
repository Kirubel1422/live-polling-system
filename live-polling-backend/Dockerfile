FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Run the seed script and then the development server
CMD ["sh", "-c", "npm run seed:templates && npm run dev"]

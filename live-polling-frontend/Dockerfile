FROM node:22-alpine

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the development server and expose host so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 1: Build Phase
# We use a Node 20 environment to compile our modern assets
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies with optimization
COPY package*.json ./
RUN npm ci

# Copy the soul of the application and build the production-ready distribution
COPY . .
RUN npm run build

# Stage 2: Production Serving Phase
# We transition to a high-performance Nginx server for the leanest production footprint
FROM nginx:stable-alpine

# Transfer the compiled 'dist' bundle to Nginx's serving sanctuary
COPY --from=build /app/dist /usr/share/nginx/html

# Transfer our custom Nginx routing scroll to handle SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Standard port for web traffic
EXPOSE 80

# Start the server and maintain a persistent presence
CMD ["nginx", "-g", "daemon off;"]

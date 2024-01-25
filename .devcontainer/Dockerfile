# .devcontainer/Dockerfile
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the application code
COPY . .

# Expose port
EXPOSE 3000



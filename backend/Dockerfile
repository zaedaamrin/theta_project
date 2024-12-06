# Use a full Node.js image
FROM node:18

# Install necessary dependencies for Playwright
RUN apt-get update && apt-get install -y \
      libnss3 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libcups2 \
      libxcomposite1 \
      libxrandr2 \
      libgbm1 \
      libpango-1.0-0 \
      libasound2 \
      libxdamage1 \
      libxkbcommon0 \
      libglu1-mesa

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including Playwright
RUN npm install

# Install Playwright browsers
RUN npx playwright install
RUN npx playwright install-deps

# Copy the rest of the application code
COPY . .

# Expose the port your Express server will run on
EXPOSE 8000

# Define the command to run the application
CMD ["node", "index.js"]

# # Command to build the docker image: docker build -t express-backend .

# # Command to run docker container: docker run -p 8000:8000 express-backend

# Use a compatible Node.js base image
# FROM node:16-bullseye

# # Install necessary dependencies for Playwright and other libraries
# RUN apt-get update && apt-get install -y \
#      libgstgl-1.0.so.0 \
#      libgstcodecparsers-1.0.so.0 \
#      libavif.so.15 \
#      libenchant-2.so.2 \
#      libsecret-1.so.0 \
#      libmanette-0.2.so.0 \
#      libGLESv2.so.2 \
#      && apt-get clean && rm -rf /var/lib/apt/lists/*

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Upgrade npm to the latest stable version
# # RUN npm install -g npm@latest

# # Install Playwright browsers
# RUN npx playwright install

# # Copy the application code
# COPY . .

# # Expose the application port
# EXPOSE 8000

# # Define the default command to start the server
# CMD ["node", "index.js"]

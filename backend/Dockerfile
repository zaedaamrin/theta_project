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

# Install dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install-deps
RUN npx playwright install

# Copy the rest of the application code
COPY . .

# Expose the port your Express server will run on
EXPOSE 8000

# Define the command to run the application
CMD ["node", "index.js"]

# Command to build the docker image: docker build -t express-backend .

# Command to run docker container: docker run -p 8000:8000 express-backend
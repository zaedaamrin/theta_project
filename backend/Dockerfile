# Use an official Node.js image as the base
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Express server will run on
EXPOSE 8000

# Define the command to run the application
CMD ["node", "index.js"]

# Command to build the docker image: docker build -t express-backend .

# Command to run docker container: docker run -p 8000:8000 express-backend
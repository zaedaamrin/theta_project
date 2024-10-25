# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire React project code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]


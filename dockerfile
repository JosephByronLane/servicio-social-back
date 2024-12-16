# Use a Node.js LTS image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port on which your Express.js app will run
EXPOSE 3000

# Command to start your Express.js app
CMD ["npm", "start"]

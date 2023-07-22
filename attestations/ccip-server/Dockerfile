# Choose a base Image
FROM node:18

# Set working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Compile the project
RUN npm run build

# Expose the port your app runs on
EXPOSE 8080

# Define the command to run your app
CMD [ "node", "dist/index.js" ]

# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the client's source code
COPY . .

# Build the app for production to the build folder
RUN npm run build

# Install a simple server for serving static content
RUN npm install -g serve

# Your app will run on port 3000
EXPOSE 3000

# Define environment variable (You can set React environment variables here)
# ENV REACT_APP_BACKEND_URL=http://backend:8010

# Run the app when the container launches
CMD ["serve", "-s", "build", "-l", "3000"]

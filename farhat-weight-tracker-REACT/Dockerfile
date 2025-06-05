# Step 1: Use Node.js as the base image
FROM node:16 AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app's code
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use a simple HTTP server to serve the app
FROM nginx:alpine

# Step 8: Copy the build output to the nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80
EXPOSE 80

# Step 10: Run the nginx server
CMD ["nginx", "-g", "daemon off;"]

# Step 1: Use official Node.js image as the base
FROM node:18

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (for dependency install)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all your source code into the container
COPY . .

# Step 6: Build the TypeScript project
RUN npm run build

# Step 7: Expose the port your app runs on (match your Express port)
EXPOSE 5000

# Step 8: Start the server using compiled JS
CMD ["node", "dist/server.js"]

# Base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app/backoffice

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install -g pnpm
RUN npm install pg --save
RUN pnpm install

# Creates a "dist" folder with the production build
RUN pnpm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
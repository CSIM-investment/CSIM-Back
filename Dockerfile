# Base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app/backoffice

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install -g pnpm
RUN pnpm install
RUN npm install -g http-server

# Creates a "dist" folder with the production build
RUN pnpm run build

# Start the server using the production build
CMD [ "http-server", "dist", "-p", "8080" ]

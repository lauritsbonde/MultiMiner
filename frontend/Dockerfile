FROM node:16.14.2-alpine

WORKDIR /usr/src/app
COPY . ./

# Run yarn install
RUN yarn install

# Build the project
RUN yarn build

# Install serve command for yarn package manager
RUN yarn global add serve

# Navigate to build folder
WORKDIR /usr/src/app/build

# Expose port 3000
EXPOSE 3000

# Run serve command
CMD ["serve", "-s", "."]

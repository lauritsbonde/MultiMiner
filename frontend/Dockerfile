FROM node:16.14.2-alpine

WORKDIR /usr/src/app
COPY . ./

RUN --mount=type=secret,id=REACT_APP_BACKEND_URL \
    export REACT_APP_BACKEND_URL=$(cat /run/secrets/REACT_APP_BACKEND_URL) && \
    echo "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL" >> .env

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

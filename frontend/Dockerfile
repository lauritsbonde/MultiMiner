FROM node:16.14.2-alpine

WORKDIR /usr/src/app
COPY . ./

RUN --mount=type=secret,id=AUTH0_SECRET \
    --mount=type=secret,id=AUTH0_BASE_URL \
    --mount=type=secret,id=AUTH0_ISSUER_BASE_URL \
    --mount=type=secret,id=AUTH0_CLIENT_ID \
    --mount=type=secret,id=AUTH0_CLIENT_SECRET \
    --mount=type=secret,id=NEXT_PUBLIC_BACKEND_URL \
    --mount=type=secret,id=NEXT_PUBLIC_ENVIRONMENT \
    export AUTH0_SECRET=$(cat /run/secrets/AUTH0_SECRET) && \
    export AUTH0_BASE_URL=$(cat /run/secrets/AUTH0_BASE_URL) && \
    export AUTH0_ISSUER_BASE_URL=$(cat /run/secrets/AUTH0_ISSUER_BASE_URL) && \
    export AUTH0_CLIENT_ID=$(cat /run/secrets/AUTH0_CLIENT_ID) && \
    export AUTH0_CLIENT_SECRET=$(cat /run/secrets/AUTH0_CLIENT_SECRET) && \
    export NEXT_PUBLIC_BACKEND_URL=$(cat /run/secrets/NEXT_PUBLIC_BACKEND_URL) && \
    export NEXT_PUBLIC_ENVIRONMENT=$(cat /run/secrets/NEXT_PUBLIC_ENVIRONMENT) && \
    echo "AUTH0_SECRET=$AUTH0_SECRET" >> .env && \
    echo "AUTH0_BASE_URL=$AUTH0_BASE_URL" >> .env && \
    echo "AUTH0_ISSUER_BASE_URL=$AUTH0_ISSUER_BASE_URL" >> .env && \
    echo "AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID" >> .env && \
    echo "AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET" >> .env && \
    echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL" >> .env && \
    echo "NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT" >> .env

# Run yarn install
RUN yarn install

# Build the project
RUN yarn build

# Navigate to build folder
WORKDIR /usr/src/app/build

# Expose port 3000
EXPOSE 3000

# Run serve command
CMD ["yarn", "start"]

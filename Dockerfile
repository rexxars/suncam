FROM node:20-alpine
LABEL version="1.0" maintainer="Espen Hovlandsdal <espen@sanity.io>"

WORKDIR /srv/app

# Install app dependencies (pre-source copy in order to cache dependencies)
COPY package.json package-lock.json tsconfig.json  ./

# Install dependencies
RUN npm ci

# Copy app source for compilation
COPY src src

# Build for production and remove dev dependencies
RUN npm run build && npm prune --omit=dev

# Run with source maps so we can trace things back to the original source
CMD [ "node", "--enable-source-maps", "lib/daemon.js" ]

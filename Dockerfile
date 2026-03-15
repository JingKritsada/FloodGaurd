# Multi-stage build for optimized React + Vite frontend
FROM node:20-alpine AS base

RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./

FROM base AS dependencies

RUN npm install && \
    npm cache clean --force

FROM dependencies AS build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY . .

RUN npm run build

FROM nginx:alpine AS production

RUN apk upgrade --no-cache

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

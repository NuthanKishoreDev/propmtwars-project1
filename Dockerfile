# Build stage
FROM node:20-alpine as build-stage
WORKDIR /app
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Nginx 1.19+ handles template substitution from /etc/nginx/templates/
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080

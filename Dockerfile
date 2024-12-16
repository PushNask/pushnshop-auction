FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Add build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

FROM nginx:alpine AS runner
# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
# Add cache control headers for static assets
RUN sed -i '/<\/head>/i \    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">' /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
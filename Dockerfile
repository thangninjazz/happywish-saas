# Dockerfile cho Next.js 15
FROM node:20-alpine AS base

# Cài đặt dependencies cần thiết
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Cài đặt dependencies dựa trên package.json
COPY package.json package-lock.json* ./
RUN npm install

# Xây dựng ứng dụng
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables cần thiết cho quá trình build (Next.js yêu cầu)
# Nên truyền vào thông qua GitHub Actions hoặc môi trường build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# Production image, copy tất cả files cần thiết và chạy Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Không chạy Next.js dưới quyền root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Tự động tạo thư mục cache cho Next.js standalone
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy các thư mục output từ bước build
# Lưu ý: Yêu cầu bật tính năng standalone trong next.config.ts (output: 'standalone')
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

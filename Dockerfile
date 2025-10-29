# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# ---------- SEED STAGE ----------
FROM node:20-alpine AS seed
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npm", "run", "seed"]


# ---------- RUNNER STAGE ----------
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
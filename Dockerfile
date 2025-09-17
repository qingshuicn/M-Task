# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY .prettierrc eslint.config.mjs ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/

RUN pnpm install --frozen-lockfile=false

FROM base AS build-frontend
COPY frontend frontend
RUN pnpm --filter frontend build

FROM base AS build-backend
COPY backend backend
RUN pnpm --filter backend build

FROM node:${NODE_VERSION}-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY package.json pnpm-workspace.yaml ./
COPY backend backend

CMD ["pnpm", "--filter", "backend", "start:prod"]

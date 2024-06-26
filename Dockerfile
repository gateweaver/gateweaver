FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter=@gateweaver/server... run -r build
RUN pnpm deploy --filter=@gateweaver/server --prod /prod/server

FROM base
COPY --from=build /prod/server /app
WORKDIR /app
CMD [ "node", "./dist/main.js" ]
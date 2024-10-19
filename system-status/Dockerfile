FROM oven/bun:1 AS base

WORKDIR /usr/src/app

COPY . .

RUN bun install

CMD ["bun", "src/app.ts"]

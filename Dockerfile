FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package.json server.mjs provider.mjs ./
COPY --chown=node:node dist/ ./dist/
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]

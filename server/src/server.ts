import express from "express";
import { ApolloServer } from "@apollo/server";

// import { typeDefs, resolvers } from "./schemas/index.js";
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./schemas/resolvers.js";
import db from "./config/connection.js";

import type { Request, Response } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import path from "node:path";
import { authenticateToken } from "./services/auth.js";
// import routes from './routes/index.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.use("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
    // app.use(routes);
  }

  app.listen(PORT, () => {
    console.log(`🌍 API server running on port ${PORT}!`);
    console.log(`🌍 Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

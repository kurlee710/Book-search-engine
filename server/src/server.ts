import express from "express";
import path from "node:path";

import type { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
// import { typeDefs, resolvers } from "./schemas/index.js";
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./schemas/resolvers.js";
import { expressMiddleware } from "@apollo/server/express4";
import { authenticateToken } from "./services/auth.js";

import db from "./config/connection.js";
// import routes from './routes/index.js';

// app.use(routes);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db.openUri(
    process.env.MONGODB_URI || "mongodb://localhost:27017/yourdbname"
  );

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

    app.get("*", (_: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

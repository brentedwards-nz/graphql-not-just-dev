import express, { Express, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import { ApolloServer, ApolloServerOptions } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from "cors";

import { getScope } from "./auth"

import schema from "./schema/schema"
import Club from "./models/club_model";

dotenv.config();

const port = process.env.PORT || 3000;
const url = process.env.DATABASE_URL || "";

const connectOptions: ConnectOptions = {};

interface MyContext {
  dataSources?: {
    source: string;
  };  
}

const app: Express = express();

const httpServer = http.createServer(app);

const bootstrapserver = async () => {
  const server = new ApolloServer<MyContext>({
    schema: schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ]
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));

  app.get("/", (req, res) => {
    res.redirect('/graphql');
  });

  app.use(expressMiddleware(
    server, 
    {
      context: async ({ req }) => {
        const authScope = await getScope(req.headers.authorization);
        return {
          user: authScope
        }
      }
    }
  ));

  app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

mongoose
  .connect(url, connectOptions)
  .then(() => {
    console.log("Mongo connected");
    bootstrapserver();
  })
  .catch((err) => {
    console.log("Error:", err);
  });






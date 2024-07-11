import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./db";
import { graphqlHTTP } from "express-graphql";
import schema from "./src/data/schema/schema";
import cors from "cors";

import decodeJwt from "./src/data/utils/decodeJwt";

const corsOptions = {
  origin: "*",
  credentials: true,
  //  access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
db;
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// const context = ({ req }: any) => {
//   const { Authorization } = req.headers;
//   if (Authorization) {
//     const { _id }: any = jwt.verify(Authorization, `${process.env.JWT_CODE}`);
//     return { _id };
//   }
// };

app.use(
  "/graphql",

  graphqlHTTP((req: any) => ({
    schema: schema,
    graphiql: true,
  }))
);

app.listen(`${process.env.PORT}`, () => {
  console.log(`This port is running on  ${process.env.PORT} `);
});

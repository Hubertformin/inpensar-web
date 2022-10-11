import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
import { initializeApp } from 'firebase-admin/app';
import * as express from "express";
import { join } from "path";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import { connect, connection } from "mongoose";
import * as cors from "cors";

// INit admin app
initializeApp();

import {useControllers} from "./routers";

const app = express();
app.use(cors());

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// Connect to database
connect(process.env.DATABASE_URI as string, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true
}).catch((err) => console.log(err));

connection.on("connected", () => {
  console.log("[SERVER]: connected to database!");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

useControllers(app);

export const api = functions.https.onRequest(app);

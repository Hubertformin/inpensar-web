import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
import {applicationDefault, initializeApp} from 'firebase-admin/app';
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import { connect} from "mongoose";
import * as cors from "cors";

// INit admin app
initializeApp({
  credential: applicationDefault(),
});

import {useControllers} from "./routers";
import {seedCategories} from "../db/seed";

const app = express();
app.use(cors());

// Connect to database
connect(process.env.DATABASE_URI as string, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true
}).then(() => {
  console.log("[SERVER]: connected to database!");
  seedCategories();
}).catch((err) => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

useControllers(app);

export const api = functions.https.onRequest(app);
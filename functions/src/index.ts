import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
import {applicationDefault, initializeApp} from 'firebase-admin/app';
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import { connect} from "mongoose";
import * as cors from "cors";
import {useControllers} from "./routers";

// INit admin app
initializeApp({
  credential: applicationDefault(),
});

const app = express();
app.use(cors());

// Connect to database
const DATABASE_URI = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URI : process.env.TEST_DATABASE_URI;
connect(DATABASE_URI as string, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true
}).then(() => {
  console.log("[SERVER]: connected to database!");
}).catch((err) => {
  console.log('DATABASE_URI not loader')
  console.log(process.env.DATABASE_URI);
  // console.error(err)
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

useControllers(app);

export const api = functions.https.onRequest(app);
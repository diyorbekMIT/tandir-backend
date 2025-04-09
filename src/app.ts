import express from "express";
import path from "path";

import router from "./router";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
import routerAdmin from "./routerAdmin";

dotenv.config(); // Load environment variables from .env file if present

const app = express();

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
});

app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads",express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev")); // Ensure MORGAN_FORMAT is defined in your config or use "dev"
app.use(cookieParser())


app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    cookie: {
        maxAge: 1000 * 3600 * 6, // 6 hours expiration
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/admin", routerAdmin);
app.use("/", router);

export default app;


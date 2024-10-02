import express from "express";
import config from "./conf";
import http from "http";
import Api from "./api";
import { join } from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToSSHDatabase } from "./database/ssh-connection";
import { connectToDatabase } from "./database/connection";

let port = config.app["port"];
let app = express();
let whitelist = Object.keys(config.whitelist).map((k) => config.whitelist[k]);

app.set("port", port);
app.use(
  bodyParser.json({
    limit: config.app["bodyLimit"],
  })
);
app.use(cookieParser(config.app["cookie_secret"]));
const type = "image/jpeg";
app.use(
  cors({
    origin: (origin, callback) => {
      console.log(origin);
      let originIsWhitelisted =
        whitelist.indexOf(origin) !== -1 || typeof origin === "undefined";
      console.log("Is IP allowed: " + originIsWhitelisted);
      let failureResp = "You are not authorized to perform this action";
      callback(originIsWhitelisted ? null : failureResp, originIsWhitelisted);
    },
  })
);

new Api(app).registerGroup();

app.use("/static", express.static(join(__dirname, "static")));
app.use("/users", express.static("uploads/users"));

(async () => {
  // await connectToSSHDatabase();
  await connectToDatabase();
  runScheduledFetch().catch((err) => {
    console.error("Error in scheduled fetch:", err);
    process.exit(1);
  });
})();

http
  .createServer(app)
  .on("error", function (ex) {
    console.log(ex);
    console.log("Can't connect to server.");
  })
  .listen(port, "0.0.0.0", () => {
    console.log(`Server Started :: ${port}`);
  });

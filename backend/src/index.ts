import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
// import 'reflect-metadata'; // We need this in order to use @Decorators
// import "reflect-metadata";
import env from "./loaders/env";
import expressLoader from "./loaders/express";
import UserModel from "./models/UserModel";

const main = async () => {
  try {
    const connection = await createConnection();
    console.log("Testing database connection...");
    const userModel = connection.getCustomRepository(UserModel);
    const usuario = await userModel.findOne({ select: ["name"] });
    console.log("User checked:", usuario);

    // load app
    const app = expressLoader();

    if (env.MODE === "development") {
      const httpServer = http.createServer(app);
      httpServer.listen(env.PORT);
    } else {
      const privateKey = fs.readFileSync(
        path.resolve(env.SSL_PATH, "privkey.pem"),
        "utf8"
      );
      const certificate = fs.readFileSync(
        path.resolve(env.SSL_PATH, "fullchain.pem"),
        "utf8"
      );
      const credentials = { key: privateKey, cert: certificate };

      const httpsServer = https.createServer(credentials, app);
      httpsServer.listen(env.PORT);
    }

    console.log(`
      ################################################
      #        Server listening on port: ${env.PORT}      #
      ################################################
    `);
  } catch (error) {
    console.log("ERRO", error);
  }
};

main();

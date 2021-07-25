import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import routes from "../api";
import HttpError from "../etc/HttpError";

const expressLoader = () => {
  const app = express();

  app.get("/status", (req, res) => {
    res.status(200).end();
  });

  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // Load API routes
  app.use("/api", routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    res.status(404);
    next(err);
  });

  // error handlers
  // app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  //   /**
  //    * Handle 401 thrown by express-jwt library
  //    */

  //   if (err.name === "UnauthorizedError") {
  //     return res.status(401).send({ message: err.message }).end();
  //   }
  //   return res.status(err.statusCode).send({ message: err.message }).end();
  // });

  // app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  //   res.status(err.statusCode || 500);
  //   res.json({
  //     errors: {
  //       message: err.message,
  //     },
  //   });
  // });

  return app;
};

export default expressLoader;

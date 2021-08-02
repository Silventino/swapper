import { Router } from "express";
import atomicRoute from "./routes/atomicRoute";

export default () => {
  const app = Router();
  atomicRoute(app);

  return app;
};

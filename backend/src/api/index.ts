import { Router } from "express";
import authRoute from "./routes/authRoute";

export default () => {
  const app = Router();
  authRoute(app);

  return app;
};

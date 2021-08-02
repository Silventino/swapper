import { Request, Response, Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/atomic", route);

  route.post("/", async (req, res) => {});

  route.get("/", (req: Request, res: Response) => {});
};

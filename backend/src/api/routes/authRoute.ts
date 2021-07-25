import { Request, Response, Router } from "express";
import { getManager } from "typeorm";
import AuthService from "../../services/AuthService";
import isAuth from "../middlewares/isAuth";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post("/", async (req, res) => {
    try {
      const EM = getManager();
      const username: string = req.body.email;
      const password: string = req.body.password;

      const authService = new AuthService();

      const { token, user } = await authService.autenticar(
        EM,
        username,
        password
      );

      return res.json({ token, user }).status(200);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  route.get("/", isAuth(), (req: Request, res: Response) => {
    // TODO refazer login
    res.send(req.body.user).status(200);
  });

  route.get("/status", (req: Request, res: Response) => {
    res.send().status(200);
  });

  route.get("/teste", async (req: Request, res: Response) => {
    res.send().status(200);
  });
};

import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { decodeToken } from "../../etc/backHelper";
import HttpError from "../../etc/HttpError";
import UserModel from "../../models/UserModel";

export const getUserByToken = async (token: string) => {
  const decoded = decodeToken(token);

  if (typeof decoded === "string") {
    throw new HttpError(403, "Erro ao decodoficar o token.");
  }

  const userModel = getCustomRepository(UserModel);
  const user = (
    await userModel.find({
      select: ["id", "name"],
      where: { id: decoded.id },
      relations: ["vendedor", "perfil"],
    })
  )[0];

  if (!user) {
    throw new HttpError(401, "Usuário não encontrado.");
  }
  return user;
};

const isAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers["authorization"];
      if (!authorization) {
        throw new HttpError(401, "Rota Privada.");
      }

      const token = authorization.split(" ")[1];
      const user = await getUserByToken(token);
      req.body.user = user;

      next();
    } catch (error) {
      res.status(error.code ?? 500).send(error.message);
      return false;
    }
  };
};

export default isAuth;

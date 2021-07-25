import { EntityManager } from "typeorm";
import { createToken } from "../etc/backHelper";
import HttpError from "../etc/HttpError";
import UserModel from "../models/UserModel";

export default class AuthService {
  async autenticar(EM: EntityManager, email: string, password: string) {
    const userModel = EM.getCustomRepository(UserModel);

    const user = await userModel.findOne({
      where: { email, password },
      select: ["id", "name", "email"],
    });

    if (!user) {
      throw new HttpError(
        404,
        "Credenciais inválidas. Verifique o usuário e a password e tente novamente."
      );
    }

    const token = createToken({ id: user.id });

    return { token, user };
  }
}

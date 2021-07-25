import { EntityRepository, Repository } from "typeorm";
import { User } from "../shared/entity/User";

@EntityRepository(User)
export default class UserModel extends Repository<User> {
  // Queries especiais aqui
}

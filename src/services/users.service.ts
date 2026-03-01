import { AppDataSource } from "@config";
import { User } from "@entity";
import { GetByUserInput, UpdateUserInput } from "@types";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

class UserService {
  constructor(
    private readonly useRepository = AppDataSource.getRepository(User),
    private readonly dataSource = AppDataSource,
  ) {}

  create(createUserInput: UpdateUserInput) {
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(createUserInput)
      .returning("*")
      .execute();
  }
  update(id: string, updateUserInput: UpdateUserInput) {
    return this.dataSource
      .createQueryBuilder()
      .update(User)
      .set(updateUserInput)
      .where("id = :id", { id })
      .execute();
  }

  getByEmail(email: string) {
    return this.useRepository
      .createQueryBuilder("user")
      .where("LOWER(user.email) = LOWER(:email)", { email })
      .getOne();
  }

  get(args?: FindOptionsWhere<GetByUserInput>) {
    return this.useRepository.findOneBy(args);
  }
  getAll(args?: FindManyOptions<GetByUserInput>) {
    return this.useRepository.find(args);
  }
}

const userService = new UserService();
export default userService;

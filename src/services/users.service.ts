import { AppDataSource } from "@config";
import { User } from "@entity";
import { GetByUserInput, UpdateUserInput, UserRoles } from "@types";
import { getPaginationOptions } from "@utils";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

class UserService {
  constructor(
    private readonly useRepository = AppDataSource.getRepository(User),
    private readonly dataSource = AppDataSource,
  ) {}

  create(createUserInput: UpdateUserInput) {
    return this.useRepository.save(createUserInput);
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
  findMembersWithPagination = async (
    organizationId: string,
    page: number,
    limit: number,
  ) => {
    const {
      limit: take,
      page: curPage,
      skip,
    } = getPaginationOptions(page, limit);

    const [data, total] = await this.useRepository.findAndCount({
      where: { organizationId, role: UserRoles.MEMBER },
      skip,
      take: take,
    });

    return {
      data,
      meta: {
        total,
        page: curPage,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  };
}

const userService = new UserService();
export default userService;

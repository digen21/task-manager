import { AppDataSource } from "@config";
import { Organizations } from "@entity";
import { GetByOrganizationsInput, UpdateOrganizationsInput } from "@types";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

class OrganizationService {
  constructor(
    private readonly organizationRepository = AppDataSource.getRepository(
      Organizations,
    ),
    private readonly dataSource = AppDataSource,
  ) {}

  create(createOrganizationInput: Organizations) {
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Organizations)
      .values(createOrganizationInput)
      .execute();
  }
  update(id: string, updateOrganizationInput: UpdateOrganizationsInput) {
    return this.dataSource
      .createQueryBuilder()
      .update(Organizations)
      .set(updateOrganizationInput)
      .where("id = :id", { id })
      .execute();
  }
  get(args?: FindOptionsWhere<GetByOrganizationsInput>) {
    return this.organizationRepository.findOneBy(args);
  }
  getAll(args?: FindManyOptions<GetByOrganizationsInput>) {
    return this.organizationRepository.find(args);
  }
}

const organizationService = new OrganizationService();
export default organizationService;

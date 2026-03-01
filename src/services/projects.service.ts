import { AppDataSource } from "@config";
import { Project } from "@entity";
import { GetByProjectInput, UpdateProjectInput } from "@types";

class ProjectService {
  constructor(
    private readonly organizationRepository = AppDataSource.getRepository(
      Project,
    ),
    private readonly dataSource = AppDataSource,
  ) {}

  create(createOrganizationInput: Project) {
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Project)
      .values(createOrganizationInput)
      .execute();
  }
  update(id: string, updateOrganizationInput: UpdateProjectInput) {
    return this.dataSource
      .createQueryBuilder()
      .update(Project)
      .set(updateOrganizationInput)
      .where("id = :id", { id })
      .execute();
  }
  get(args: GetByProjectInput) {
    return this.organizationRepository.findOneBy(args);
  }
  getAll(args: GetByProjectInput) {
    return this.organizationRepository.find({ where: args });
  }
}

const projectService = new ProjectService();
export default projectService;

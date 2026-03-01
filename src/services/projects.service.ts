import { AppDataSource } from "@config";
import { Project, ProjectMember } from "@entity";
import { GetByProjectInput, UpdateProjectInput } from "@types";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

class ProjectService {
  constructor(
    private readonly projectRepository = AppDataSource.getRepository(Project),
    private readonly projectMemberRepository = AppDataSource.getRepository(
      ProjectMember,
    ),
    private readonly dataSource = AppDataSource,
  ) {}

  create(createProjectInput: Partial<Project>) {
    return this.projectRepository.save(createProjectInput);
  }

  update(id: string, updateProjectInput: UpdateProjectInput) {
    return this.dataSource
      .createQueryBuilder()
      .update(Project)
      .set(updateProjectInput)
      .where("id = :id", { id })
      .execute();
  }
  get(args?: FindOptionsWhere<GetByProjectInput>) {
    return this.projectRepository.findOneBy(args);
  }
  getAll(args?: FindManyOptions<GetByProjectInput>) {
    return this.projectRepository.find(args);
  }

  createProjectMember(createProjectMemberInput: Partial<ProjectMember>) {
    return this.projectMemberRepository.save(createProjectMemberInput);
  }

  getProjectMembers(args?: FindManyOptions<ProjectMember>) {
    return this.projectMemberRepository.find(args);
  }

  getProjectMember(args?: FindOptionsWhere<ProjectMember>) {
    return this.projectMemberRepository.findOneBy(args);
  }
}

const projectService = new ProjectService();
export default projectService;

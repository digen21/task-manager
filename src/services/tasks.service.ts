import { AppDataSource } from "@config";
import { Task } from "@entity";
import { GetByTaskInput, UpdateTaskInput } from "@types";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

class TaskService {
  constructor(
    private readonly taskRepository = AppDataSource.getRepository(Task),
    private readonly dataSource = AppDataSource,
  ) {}

  create(createTaskInput: Task) {
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values(createTaskInput)
      .execute();
  }
  update(id: string, updateTaskInput: UpdateTaskInput) {
    return this.dataSource
      .createQueryBuilder()
      .update(Task)
      .set(updateTaskInput)
      .where("id = :id", { id })
      .execute();
  }
  get(args?: FindOptionsWhere<GetByTaskInput>) {
    return this.taskRepository.findOneBy(args);
  }
  getAll(args?: FindManyOptions<GetByTaskInput>) {
    return this.taskRepository.find(args);
  }
}

const taskService = new TaskService();
export default taskService;

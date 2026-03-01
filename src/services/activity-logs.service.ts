import { AppDataSource } from "@config";
import { ActivityLogs } from "@entity";
import { GetByActivityLogsInput, UpdateActivityLogsInput } from "@types";

class ActivityLogService {
  constructor(
    private readonly organizationRepository = AppDataSource.getRepository(
      ActivityLogs,
    ),
    private readonly dataSource = AppDataSource,
  ) {}

  create(createOrganizationInput: ActivityLogs) {
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(ActivityLogs)
      .values(createOrganizationInput)
      .execute();
  }
  update(id: string, updateOrganizationInput: UpdateActivityLogsInput) {
    return this.dataSource
      .createQueryBuilder()
      .update(ActivityLogs)
      .set(updateOrganizationInput)
      .where("id = :id", { id })
      .execute();
  }
  get(args: GetByActivityLogsInput) {
    return this.organizationRepository.findOneBy(args);
  }
  getAll(args: GetByActivityLogsInput) {
    return this.organizationRepository.find({ where: args });
  }
}

const activityLogService = new ActivityLogService();
export default activityLogService;

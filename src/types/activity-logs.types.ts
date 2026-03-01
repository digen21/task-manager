import { ActivityLogs } from "@entity";

export type UpdateActivityLogsInput = Partial<Omit<ActivityLogs, "id">>;
export type GetByActivityLogsInput = Partial<ActivityLogs>;

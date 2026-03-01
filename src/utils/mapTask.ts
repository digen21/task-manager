type RawTaskRow = Record<string, unknown>;

const mapTask = (row: RawTaskRow) => ({
  id: row.task_id,
  title: row.task_title,
  status: row.task_status,
  version: row.task_version,
  dueDate: row.due_date,
  createdAt: row.task_created_at,
  project: row.project_id && {
    id: row.project_id,
    name: row.project_name,
  },
  assignee: row.assignee_id && {
    id: row.assignee_id,
    email: row.assignee_email,
  },
  creator: row.creator_id && {
    id: row.creator_id,
    email: row.creator_email,
  },
});

export default mapTask;

import { User } from "@entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "./Task.entity";

@Entity({ name: "activity_logs" })
export class ActivityLogs {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "task", type: "uuid" })
  taskId: string;

  @Column({ name: "performed_by", type: "uuid" })
  performedById: string;

  @Column()
  action: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @ManyToOne(() => Task)
  @JoinColumn({
    name: "task",
    foreignKeyConstraintName: "activity_logs_task_fkey_id",
  })
  task: Task;

  @ManyToOne(() => User)
  @JoinColumn({
    foreignKeyConstraintName: "activity_logs_performed_by_fkey_id",
    name: "performed_by",
  })
  performedBy: User;
}

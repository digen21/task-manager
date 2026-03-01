import { TaskStatus } from "@types";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";
import { Organizations } from "./Organizations.entity";
import { Project } from "./Project.entity";
import { User } from "./User.entity";

@Entity({
  name: "tasks",
})
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index("task_title_idx")
  title: string;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.TODO })
  @Index("task_status_idx")
  status: TaskStatus;

  @ManyToOne(() => Organizations)
  organization: Organizations;

  @VersionColumn()
  @Index("task_version_idx")
  version: number;

  @Column({ name: "project", type: "uuid" })
  projectId: string;

  @Column({ name: "assignee", type: "uuid" })
  assigneeId: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: Date;

  @Column({
    nullable: true,
    name: "completed_at",
  })
  completedAt: Date;

  @Column({
    nullable: true,
    name: "deleted_at",
  })
  deletedAt: Date;

  @ManyToOne(() => Project)
  @JoinColumn({
    name: "project",
    foreignKeyConstraintName: "tasks_project_fkey_id",
  })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "assignee",
    foreignKeyConstraintName: "tasks_user_fkey_id",
  })
  assignee: User;
}

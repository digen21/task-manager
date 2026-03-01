import { UserRoles } from "@types";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./Project.entity";
import { User } from "./User.entity";

@Entity({ name: "project_members" })
@Index(["projectId", "userId"], { unique: true })
class ProjectMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ type: "uuid", name: "project" })
  projectId: string;

  @Column({ type: "uuid", name: "user" })
  userId: string;

  @Column({ type: "enum", enum: UserRoles })
  role: UserRoles;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project" })
  project: Project;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user" })
  user: User;
}

export default ProjectMember;

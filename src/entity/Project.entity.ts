import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Organizations } from "./Organizations.entity";

@Entity({
  name: "projects",
})
export class Project {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column()
  name: string;

  @Column({ name: "organization", type: "uuid" })
  organizationId: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @CreateDateColumn({
    name: "deleted_at",
  })
  deletedAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: Date;

  @ManyToOne(() => Organizations)
  @JoinColumn({
    name: "organization",
    foreignKeyConstraintName: "projects_organization_fkey_id",
  })
  organization: Organizations;
}

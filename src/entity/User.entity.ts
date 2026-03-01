import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from "typeorm";
import { Organizations } from "./Organizations.entity";
import { UserRoles } from "@types";

@Entity({
  name: "users",
})
export class User {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column({ nullable: false })
  @Index({
    unique: true,
  })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: "organization", type: "uuid" })
  organizationId: string;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.MEMBER })
  role: UserRoles;

  @Column({
    nullable: true,
    name: "deleted_at",
  })
  deletedAt: Date;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedDate: Date;

  @ManyToOne(() => Organizations)
  @JoinColumn({
    name: "organization",
    foreignKeyConstraintName: "user_organization_fkey_id",
  })
  organization: Organizations;
}

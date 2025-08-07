import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "../../../../../auth/infrastructure/database/postgres/entities/user.orm-entity";

@Entity({ name: "projects" })
export class ProjectOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.projects, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserOrmEntity;

  @Column({ name: "user_id", type: "int" })
  userId: number;

  @Column({ name: "repo_path", type: "varchar", length: 255 })
  repoPath: string;

  @Column({ type: "varchar", length: 512 })
  url: string;

  @Column({ type: "int", default: 0 })
  stars: number;

  @Column({ type: "int", default: 0 })
  forks: number;

  @Column({ type: "int", default: 0 })
  issues: number;

  @Column({
    name: "created_at",
    type: "bigint",
    default: () => "EXTRACT(EPOCH FROM NOW())::bigint",
  })
  createdAt: string;
}

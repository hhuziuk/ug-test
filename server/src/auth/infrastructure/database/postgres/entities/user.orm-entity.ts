import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectOrmEntity } from "../../../../../projects/infrastructure/database/postgres/entities/project.orm-entity";

@Entity({ name: "users" })
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: "password_hash" })
  passwordHash: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "refresh_token_hash", type: "varchar", nullable: true })
  refreshTokenHash: string | null;

  @Column({
    name: "refresh_token_expires_at",
    type: "timestamp",
    nullable: true,
  })
  refreshTokenExpiresAt: Date | null;

  @OneToMany(() => ProjectOrmEntity, (project) => project.user)
  projects: ProjectOrmEntity[];
}

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult, DeleteResult } from "typeorm";

import { IProjectRepository } from "./project.repository.interface";
import { Project } from "../../../../domain/entities/project.entity";
import { RepoPath } from "../../../../domain/value-objects/repo-path.vo";
import { GitHubUrl } from "../../../../domain/value-objects/github-url.vo";
import { ProjectStats } from "../../../../domain/value-objects/project-stats.vo";
import { ProjectNotFoundException } from "../../../exceptions/project-not-found.exception";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { ProjectOrmEntity } from "../entities/project.orm-entity";

@Injectable()
export class ProjectRepository implements IProjectRepository {
  private readonly logger = new Logger(ProjectRepository.name);

  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly repo: Repository<ProjectOrmEntity>,
  ) {}

  async findById(id: string): Promise<Project | null> {
    this.logger.debug(`findById: ${id}`);
    const orm = await this.repo.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!orm) return null;
    return this.toDomain(orm);
  }

  async findAllByUser(userId: string): Promise<Project[]> {
    this.logger.debug(`findAllByUser: ${userId}`);
    const orms = await this.repo.find({
      where: { userId: +userId },
      order: { createdAt: "DESC" },
      relations: ["user"],
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  async create(
    userId: string,
    repoPath: RepoPath,
    url: GitHubUrl,
    stats: ProjectStats,
  ): Promise<Project> {
    this.logger.debug(`create project for user ${userId}: ${repoPath.getValue()}`);
    const orm = this.repo.create({
      userId: +userId,
      repoPath: repoPath.getValue(),
      url: url.getValue(),
      stars: stats.stars,
      forks: stats.forks,
      issues: stats.issues,
    });

    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async updateStats(id: string, stats: ProjectStats): Promise<Project> {
    this.logger.debug(`updateStats for project ${id}`);

    const partialUpdate: QueryDeepPartialEntity<ProjectOrmEntity> = {
      stars: stats.stars,
      forks: stats.forks,
      issues: stats.issues,
    };

    const result: UpdateResult = await this.repo.update(id, partialUpdate);
    if (result.affected === 0) {
      this.logger.warn(`Project not found: ${id}`);
      throw new ProjectNotFoundException(id);
    }

    const updated = await this.repo.findOneOrFail({
      where: { id },
      relations: ["user"],
    });

    return this.toDomain(updated);
  }

  async findAllByUserId(userId: string): Promise<Project[]> {
    const projects = await this.repo.find({
      where: { user: { id: Number(userId) } },
      order: { createdAt: "DESC" },
    });
    return projects.map((p) => this.toDomain(p));
  }

  async delete(id: string): Promise<void> {
    this.logger.debug(`delete project ${id}`);
    const result: DeleteResult = await this.repo.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Project not found: ${id}`);
      throw new ProjectNotFoundException(id);
    }
  }

  private toDomain(entity: ProjectOrmEntity): Project {
    const repoPath = RepoPath.create(entity.repoPath);
    const url = GitHubUrl.fromRepoPath(repoPath);
    const stats = new ProjectStats(entity.stars, entity.forks, entity.issues);
    const createdAt = Number(entity.createdAt);
    return new Project(entity.id, entity.userId, repoPath, url, stats, createdAt);
  }
}

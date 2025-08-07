import { Project } from "../../../../domain/entities/project.entity";
import { RepoPath } from "../../../../domain/value-objects/repo-path.vo";
import { GitHubUrl } from "../../../../domain/value-objects/github-url.vo";
import { ProjectStats } from "../../../../domain/value-objects/project-stats.vo";

export const IProjectRepository = Symbol("IProjectRepository");

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAllByUser(userId: string): Promise<Project[]>;
  create(userId: string, repoPath: RepoPath, url: GitHubUrl, stats: ProjectStats): Promise<Project>;
  updateStats(id: string, stats: ProjectStats): Promise<Project>;
  findAllByUserId(userId: string): Promise<Project[]>;
  delete(id: string): Promise<void>;
}

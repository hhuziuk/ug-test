import { Inject, Injectable, ForbiddenException } from "@nestjs/common";
import { IProjectRepository } from "../../infrastructure/database/postgres/repositories/project.repository.interface";
import { GitHubService } from "../../infrastructure/services/github/github.service";
import { ProjectStats } from "../../domain/value-objects/project-stats.vo";
import { Project } from "../../domain/entities/project.entity";

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepository: IProjectRepository,
    private readonly githubService: GitHubService,
  ) {}

  async execute(projectId: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new ForbiddenException("Project not found.");
    }

    if (project.userId !== Number(userId)) {
      throw new ForbiddenException("You don't have permission to update this project.");
    }

    const githubData = await this.githubService.fetchRepository(project.repoPath.getValue());
    const newStats = new ProjectStats(githubData.stars, githubData.forks, githubData.issues);

    return this.projectRepository.updateStats(projectId, newStats);
  }
}

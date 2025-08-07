import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { GitHubService } from "./github.service";
import { RepoPath } from "../../../domain/value-objects/repo-path.vo";
import { GitHubUrl } from "../../../domain/value-objects/github-url.vo";
import { ProjectStats } from "../../../domain/value-objects/project-stats.vo";
import { ProjectException } from "../../exceptions/project.exceptions";
import { IProjectRepository } from "../../database/postgres/repositories/project.repository.interface";
import { Inject, Logger } from "@nestjs/common";

@Processor("github-projects")
export class GitHubProcessor {
  private readonly logger = new Logger(GitHubProcessor.name);

  constructor(
    private readonly githubService: GitHubService,
    @Inject(IProjectRepository)
    private readonly projectRepository: IProjectRepository,
  ) {}

  @Process("create-project")
  async handleCreateProject(job: Job<{ userId: string; repoPath: string }>) {
    this.logger.log(`Processing job ${job.id} for repo: ${job.data.repoPath}`);
    const { userId, repoPath } = job.data;

    try {
      const repoPathVo = RepoPath.create(repoPath);
      const githubData = await this.githubService.fetchRepository(repoPath);

      this.logger.debug(`Fetched data from GitHub for ${repoPath}`);

      const url = GitHubUrl.fromRepoPath(repoPathVo);
      const stats = new ProjectStats(githubData.stars, githubData.forks, githubData.issues);

      await this.projectRepository.create(userId, repoPathVo, url, stats);

      this.logger.log(`Successfully processed and saved project ${repoPath}`);
    } catch (err) {
      this.logger.error(
        `Failed to process job ${job.id} for repo ${repoPath}. Error: ${err}`,
        err.stack,
      );

      if (err instanceof ProjectException) {
        throw err;
      }
      throw new ProjectException(
        `Error processing GitHub project job for ${repoPath}`,
        err as Error,
      );
    }
  }
}

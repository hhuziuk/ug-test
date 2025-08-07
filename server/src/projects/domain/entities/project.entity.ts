import { RepoPath } from "../value-objects/repo-path.vo";
import { GitHubUrl } from "../value-objects/github-url.vo";
import { ProjectStats } from "../value-objects/project-stats.vo";

export class Project {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly repoPath: RepoPath,
    public readonly url: GitHubUrl,
    public readonly stats: ProjectStats,
    public readonly createdAt: number,
  ) {}

  updateStats(stats: ProjectStats): Project {
    return new Project(this.id, this.userId, this.repoPath, this.url, stats, this.createdAt);
  }
}

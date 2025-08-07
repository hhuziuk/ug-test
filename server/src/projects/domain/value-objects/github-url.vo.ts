import { RepoPath } from "./repo-path.vo";

export class GitHubUrl {
  private constructor(private readonly value: string) {}

  static fromRepoPath(repoPath: RepoPath): GitHubUrl {
    return new GitHubUrl(`https://github.com/${repoPath.getValue()}`);
  }

  getValue(): string {
    return this.value;
  }
}

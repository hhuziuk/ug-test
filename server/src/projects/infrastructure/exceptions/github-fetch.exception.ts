import { ProjectException } from "./project.exceptions";

export class GitHubFetchException extends ProjectException {
  constructor(repoPath: string, cause?: Error) {
    super(`Failed to fetch GitHub repository: ${repoPath}`, cause);
  }
}

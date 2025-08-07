import { ProjectException } from "./project.exceptions";

export class InvalidRepoPathException extends ProjectException {
  constructor(repoPath: string) {
    super(`Invalid GitHub repo path format: ${repoPath}`);
  }
}

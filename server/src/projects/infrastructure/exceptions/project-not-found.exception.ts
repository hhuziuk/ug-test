import { ProjectException } from "./project.exceptions";

export class ProjectNotFoundException extends ProjectException {
  constructor(projectId: string, cause?: Error) {
    super(`Project with id ${projectId} not found`, cause);
  }
}

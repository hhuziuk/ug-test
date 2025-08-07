import { Inject, Injectable, ForbiddenException } from "@nestjs/common";
import { IProjectRepository } from "../../infrastructure/database/postgres/repositories/project.repository.interface";

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(IProjectRepository)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(projectId: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      return;
    }

    if (project.userId !== Number(userId)) {
      throw new ForbiddenException("You don't have permission to delete this project.");
    }

    await this.projectRepository.delete(projectId);
  }
}

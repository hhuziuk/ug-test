import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { Injectable, Logger } from "@nestjs/common";
import { RepoPath } from "../../domain/value-objects/repo-path.vo";
import { AddProjectDto } from "../dto/add-project.dto";

@Injectable()
export class AddProjectUseCase {
  private readonly logger = new Logger(AddProjectUseCase.name);

  constructor(
    @InjectQueue("github-projects")
    private readonly githubQueue: Queue,
  ) {}

  async execute(dto: AddProjectDto): Promise<void> {
    RepoPath.create(dto.repoPath);

    this.logger.log(`Adding job to 'github-projects' queue with data: ${JSON.stringify(dto)}`);
    await this.githubQueue.add("create-project", dto);
    this.logger.log(`Job successfully added to queue.`);
  }
}

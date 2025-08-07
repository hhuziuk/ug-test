import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bull";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectOrmEntity } from "./infrastructure/database/postgres/entities/project.orm-entity";
import { ProjectRepository } from "./infrastructure/database/postgres/repositories/project.repository";
import { GitHubService } from "./infrastructure/services/github/github.service";
import { GitHubProcessor } from "./infrastructure/services/github/github.processor";
import { AddProjectUseCase } from "./application/use-cases/add-project.use-case";
import { ProjectsController } from "./presentation/controllers/projects.controller";
import {GetProjectsUseCase} from "./application/use-cases/get-projects.use-case";
import {IProjectRepository} from "./infrastructure/database/postgres/repositories/project.repository.interface";
import {DeleteProjectUseCase} from "./application/use-cases/delete-project.use-case";
import {UpdateProjectUseCase} from "./application/use-cases/update-project.use-case";

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: "github-projects",
    }),
    TypeOrmModule.forFeature([ProjectOrmEntity]),
  ],
  controllers: [ProjectsController],
  providers: [
    GitHubService,
    GitHubProcessor,
    AddProjectUseCase,
    GetProjectsUseCase,
    DeleteProjectUseCase,
    UpdateProjectUseCase,
    {
      provide: IProjectRepository,
      useClass: ProjectRepository,
    },
  ],
})
export class ProjectsModule {}

import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../infrastructure/database/postgres/repositories/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class GetProjectsUseCase {
    constructor(
        @Inject(IProjectRepository)
        private readonly projectRepository: IProjectRepository,
    ) {}

    async execute(userId: string): Promise<Project[]> {
        return this.projectRepository.findAllByUserId(userId);
    }
}
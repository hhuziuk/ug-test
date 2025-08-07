import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../../../shared/guards/jwt-auth.guard";
import { AddProjectUseCase } from "../../application/use-cases/add-project.use-case";
import { AddProjectDto } from "../dto/add-project.dto";
import { GetProjectsUseCase } from "../../application/use-cases/get-projects.use-case";
import { Project } from "../../domain/entities/project.entity";
import { DeleteProjectUseCase } from "../../application/use-cases/delete-project.use-case";
import { UpdateProjectUseCase } from "../../application/use-cases/update-project.use-case";

@ApiTags("Projects")
@ApiBearerAuth()
@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly addProject: AddProjectUseCase,
    private readonly getProjects: GetProjectsUseCase,
    private readonly deleteProject: DeleteProjectUseCase,
    private readonly updateProject: UpdateProjectUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: "Add a new GitHub project by path" })
  @ApiBody({ type: AddProjectDto })
  @ApiResponse({
    status: 202,
    description: "Project is being processed in the background",
  })
  @ApiResponse({ status: 400, description: "Invalid GitHub repo path" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async create(@Body() body: { repoPath: string }, @Request() req: any) {
    const dto: AddProjectDto = {
      userId: req.user.userId,
      repoPath: body.repoPath,
    };
    await this.addProject.execute(dto);
    return { message: "project is adding on the background" };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all projects for the current user" })
  @ApiResponse({ status: 200, description: "List of user's projects" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findAll(@Request() req: any): Promise<Project[]> {
    return this.getProjects.execute(req.user.userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a project by ID" })
  @ApiResponse({ status: 204, description: "Project deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async remove(@Param("id") id: string, @Request() req: any): Promise<void> {
    await this.deleteProject.execute(id, req.user.userId);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Refresh a project's data from GitHub" })
  @ApiResponse({ status: 200, description: "Project updated successfully", type: Project })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async update(@Param("id") id: string, @Request() req: any): Promise<Project> {
    return this.updateProject.execute(id, req.user.userId);
  }
}

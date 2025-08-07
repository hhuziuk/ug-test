import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsUUID } from "class-validator";

export class AddProjectDto {
  @ApiProperty({
    description: "User ID (UUID)",
    example: "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "GitHub repo path (format: owner/repo)",
    example: "facebook/react",
  })
  @IsString()
  @Matches(/^[\w-]+\/[\w.-]+$/, {
    message: "Invalid GitHub repo path format. Expected: owner/repo",
  })
  repoPath: string;
}

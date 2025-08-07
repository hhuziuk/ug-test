import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class RefreshDto {
  @ApiProperty({ description: "User ID", format: "uuid" })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: "JWT refresh token" })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "User email" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User password (min 6 chars)" })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ description: "Raw email provided by user (used for login)" })
  @IsEmail()
  @IsNotEmpty()
  emailRaw: string;

  @ApiProperty({ description: "Raw password provided by user (min 6 chars)" })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  passwordRaw: string;
}

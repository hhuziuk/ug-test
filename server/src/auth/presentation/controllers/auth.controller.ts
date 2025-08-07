import { Controller, Post, HttpCode, HttpStatus, UseGuards, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { RefreshUseCase } from "../../application/use-cases/refresh.use-case";

import { JwtRefreshGuard } from "../../../shared/guards/jwt-refresh.guard";
import { TokensDto } from "../dto/tokens.dto";
import { RegisterDto } from "../dto/register.dto";
import { Tokens } from "../../domain/interfaces /tokens.interface";
import {RefreshDto} from "../dto/refresh.dto";
import {LoginDto} from "../dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: TokensDto,
  })
  @ApiResponse({ status: 400, description: "Validation error or email in use" })
  async register(@Body() dto: RegisterDto): Promise<Tokens> {
    const user = await this.registerUseCase.execute(dto);
    return this.loginUseCase.execute({
      email: dto.emailRaw,
      password: dto.passwordRaw,
    });
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Log in with email and password" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Logged in, tokens returned", type: TokensDto })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.loginUseCase.execute(dto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiBearerAuth("refresh-token")
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ status: 200, description: "Tokens refreshed", type: TokensDto })
  @ApiResponse({ status: 401, description: "Invalid or expired refresh token" })
  async refresh(@Body() dto: RefreshDto): Promise<Tokens> {
    return this.refreshUseCase.execute(dto);
  }
}

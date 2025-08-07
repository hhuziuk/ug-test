import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

export interface GitHubRepoData {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  createdAt: number;
}

@Injectable()
export class GitHubService {
  private readonly githubApiUrl = "https://api.github.com/repos";

  constructor(private readonly httpService: HttpService) {}

  async fetchRepository(path: string): Promise<GitHubRepoData> {
    if (!/^[\w-]+\/[\w.-]+$/.test(path)) {
      throw new HttpException("Invalid GitHub repo path", HttpStatus.BAD_REQUEST);
    }

    const url = `${this.githubApiUrl}/${path}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      const data = response.data;

      return {
        owner: data.owner.login,
        name: data.name,
        url: data.html_url,
        stars: data.stargazers_count,
        forks: data.forks_count,
        issues: data.open_issues_count,
        createdAt: new Date(data.created_at).getTime() / 1000,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to fetch GitHub repository",
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

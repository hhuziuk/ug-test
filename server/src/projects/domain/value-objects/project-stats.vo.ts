export class ProjectStats {
  constructor(
    public readonly stars: number,
    public readonly forks: number,
    public readonly issues: number,
  ) {
    if (stars < 0 || forks < 0 || issues < 0) {
      throw new Error("Stats cannot be negative");
    }
  }
}

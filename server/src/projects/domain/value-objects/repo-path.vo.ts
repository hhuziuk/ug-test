export class RepoPath {
  private constructor(private readonly value: string) {}

  static create(value: string): RepoPath {
    if (!/^[\w-]+\/[\w.-]+$/.test(value)) {
      throw new Error("Invalid repo path format (e.g. facebook/react)");
    }
    return new RepoPath(value);
  }

  getOwner(): string {
    return this.value.split("/")[0];
  }

  getName(): string {
    return this.value.split("/")[1];
  }

  getValue(): string {
    return this.value;
  }
}

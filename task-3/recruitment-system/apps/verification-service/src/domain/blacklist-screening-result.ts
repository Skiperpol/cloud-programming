export class BlacklistScreeningResult {
  private constructor(public readonly isBlacklisted: boolean) {}

  static fromEntry(
    entry: { blocked?: boolean } | null | undefined,
  ): BlacklistScreeningResult {
    return new BlacklistScreeningResult(Boolean(entry?.blocked));
  }
}

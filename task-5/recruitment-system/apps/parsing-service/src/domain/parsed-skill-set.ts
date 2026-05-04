export class ParsedSkillSet {
  private static readonly STUB_SKILLS: readonly string[] = ['Java', 'SQL'];

  private constructor(public readonly skills: readonly string[]) {}

  static stub(): ParsedSkillSet {
    return new ParsedSkillSet(ParsedSkillSet.STUB_SKILLS);
  }

  toPersistedArray(): string[] {
    return [...this.skills];
  }
}

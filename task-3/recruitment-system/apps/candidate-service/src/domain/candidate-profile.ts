export class CandidateProfile {
  private constructor(public readonly email: string) {}

  static forEmail(email: string): CandidateProfile {
    return new CandidateProfile(email);
  }
}

export class ApplicationSubmittedEvent {
  constructor(
    public readonly email: string,
    public readonly applicationId: string,
  ) {}
}

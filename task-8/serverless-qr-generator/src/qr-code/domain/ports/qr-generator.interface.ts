export interface IQrGenerator {
  generate(data: string): Promise<Buffer>;
}

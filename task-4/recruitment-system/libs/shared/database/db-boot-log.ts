import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type DbBootBackend = 'postgres' | 'redis';
export type DbBootPhase = 'connecting' | 'connected' | 'failed';

export function appendDbBootLog(
  serviceName: string,
  backend: DbBootBackend,
  phase: DbBootPhase,
  detail?: string,
): void {
  const ts = new Date().toISOString();
  const extra = detail ? ` ${detail.replace(/\s+/g, ' ').slice(0, 500)}` : '';
  const line = `${ts}\t${serviceName}\t${backend}\t${phase}${extra}\n`;
  try {
    const dir = join(process.cwd(), 'logs');
    mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, 'db-connection.log'), line);
  } catch {
    void 0;
  }
}

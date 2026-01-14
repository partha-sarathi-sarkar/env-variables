import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_DIR = path.resolve(__dirname, '../../logs');

// export class Logger {
//   private logs: string[] = [];
//   private maskedToken: string;

//   constructor(token: string) {
//     this.maskedToken = token.slice(0, 7) + '********';
//   }

//   log(message: string): void {
//     const timestamp = new Date().toISOString();
//     const entry = `[${timestamp}] ${message}`;
//     this.logs.push(entry);
//     console.log(entry);
//   }

//   logConfig(config: { owner: string; repo: string }): void {
//     this.log(`Repository: ${config.owner}/${config.repo}`);
//     this.log(`Token: ${this.maskedToken}`);
//   }

//   async saveToFile(): Promise<void> {
//     await fs.mkdir(LOG_DIR, { recursive: true });
//     const fileName = `deploy-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
//     const filePath = path.join(LOG_DIR, fileName);
//     await fs.writeFile(filePath, this.logs.join('\n'), 'utf-8');
//     this.log(`Log saved to: ${filePath}`);
//   }
// }
export class Logger {
  private logs: string[] = [];
  private maskedToken: string;

  constructor(token: string) {
    this.maskedToken = token.slice(0, 7) + '********';
  }

  log(message: string): void {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  logConfig(config: { owner: string; repo: string }): void {
    this.log(`Repository: ${config.owner}/${config.repo}`);
    this.log(`Token: ${this.maskedToken}`);
  }

  async saveToFile(): Promise<void> {
    await fs.mkdir(LOG_DIR, { recursive: true });
    
    // Format: logfile-{env}-YYYY-MM-DD.log
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `logfile-${dateStr}.log`;
    
    const filePath = path.join(LOG_DIR, fileName);
    await fs.writeFile(filePath, this.logs.join('\n'), 'utf-8');
    this.log(`Log saved to: ${filePath}`);
  }
}

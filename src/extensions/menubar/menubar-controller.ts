import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { logger } from '../../logger.js';

export class MenubarController {
  private swiftProcess: any = null;
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  public start(): void {
    if (process.platform !== 'darwin') return;

    const swiftPath = path.join(
      this.projectRoot,
      'src',
      'extensions',
      'menubar',
      'menubar.swift',
    );
    if (!fs.existsSync(swiftPath)) {
      logger.warn('Menubar Swift script not found, skipping menubar icon');
      return;
    }

    logger.info('Starting Menubar icon controller...');
    this.swiftProcess = spawn('swift', [swiftPath]);

    this.swiftProcess.stdout.on('data', (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleEvent(message.event);
      } catch (e) {
        // Ignore non-JSON output
      }
    });

    this.swiftProcess.on('error', (err: any) => {
      logger.error({ err }, 'Menubar controller failed to start');
    });

    this.swiftProcess.on('exit', () => {
      logger.info('Menubar icon process exited');
    });
  }

  private handleEvent(event: string): void {
    logger.info({ event }, 'Menubar event received');

    switch (event) {
      case 'restart':
        this.restartService();
        break;
      case 'open_logs':
        this.openLogs();
        break;
      case 'quit':
        process.exit(0);
        break;
    }
  }

  private restartService(): void {
    const restartCmd = `launchctl kickstart -k gui/$(id -u)/com.nanoclaw`;
    exec(restartCmd, (err) => {
      if (err) {
        logger.error({ err }, 'Failed to restart service from menubar');
      }
    });
  }

  private openLogs(): void {
    const logsDir = path.join(this.projectRoot, 'logs');
    exec(`open "${logsDir}"`);
  }

  public stop(): void {
    if (this.swiftProcess) {
      this.swiftProcess.kill();
    }
  }
}

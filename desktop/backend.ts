import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as settings from './settings';
import log from 'electron-log';
import { spawn } from 'child_process';

export async function unzipEnvironment(): Promise<void> {
    const zipFilePath = settings.DIST_PYTHON_VENV
    const outputDir = settings.APP_PYTHON_VENV

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Unzip the file
    return new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: outputDir }))
            .on('close', () => {
                log.info('Unzipped the virtual environment successfully.');
                resolve();
            })
            .on('error', (err) => {
                log.error('Failed to unzip the virtual environment:', err);
                reject(err);
            });
    });
}

export async function activateEnvAndRunFastAPI(): Promise<void> {
    const venvPath = settings.APP_PYTHON_VENV
    const isWindows = process.platform === 'win32';
    const activateScript = isWindows 
        ? path.join(venvPath, 'Scripts', 'activate.bat')
        : path.join(venvPath, 'bin', 'activate');

    return new Promise((resolve, reject) => {
        const command = isWindows
            ? `${activateScript} && python -m server ${settings.APP_TMP} --port 4040`
            : `source ${activateScript} && python -m server ${settings.APP_TMP} --port 4040`;

        const shell = isWindows ? 'cmd.exe' : 'bash';

        const fastAPIServer = spawn(shell, ['-c', command], { cwd: venvPath });

        fastAPIServer.stdout.on('data', (data) => {
            log.info(`FastAPI stdout: ${data}`);
        });

        fastAPIServer.stderr.on('data', (data) => {
            log.error(`FastAPI stderr: ${data}`);
        });

        fastAPIServer.on('close', (code) => {
            if (code !== 0) {
                log.error(`FastAPI server exited with code ${code}`);
                reject(new Error(`FastAPI server exited with code ${code}`));
            } else {
                resolve();
            }
        });

        // Kill the fastAPIServer when the node process exits
        process.on('exit', () => {
            log.info('[spawnFile]', { message: `exiting child process on node exit` })
            fastAPIServer.kill()
        })

        resolve()
    });
}

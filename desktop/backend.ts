import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as settings from './settings';
import {exec} from 'child_process';

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
                console.log('Unzipped the virtual environment successfully.');
                resolve();
            })
            .on('error', (err) => {
                console.error('Failed to unzip the virtual environment:', err);
                reject(err);
            });
    });
}

export async function activateEnvAndRunFastAPI(): Promise<void> {
    const venvPath = settings.APP_PYTHON_VENV
    const isWindows = process.platform === 'win32';
    const activateScript = isWindows 
        ? path.join(venvPath, 'Scripts', 'activate') 
        : path.join(venvPath, 'bin', 'activate');

    return new Promise((resolve, reject) => {
        const command = isWindows
            ? `cmd.exe /c "${activateScript} && python -m server ${settings.APP_TMP} --port 4040"`
            : `bash -c "source ${activateScript} && python -m server ${settings.APP_TMP} --port 4040"`;

        exec(command, { cwd: venvPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running FastAPI server: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            resolve();
        });
    });
}

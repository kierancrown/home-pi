import { getZipOfFolder } from '../utils/zip';
import { mkdir, writeFile, readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import Log from '../utils/log';
import ora from 'ora';
import { green, red, yellow } from 'chalk';
import { exec } from 'child_process';

const buildLambdas = async (dirs: string[], logger: Log): Promise<string[]> => {
    const execAsync = (command: string, cwd = __dirname): Promise<string> => {
        return new Promise((resolve, reject) => {
            exec(command, { cwd }, (error, stdout, stderr) => {
                if (error) reject(error);
                if (stderr) logger.log({ verbose: true }, red(stderr));
                resolve(stdout);
            });
        });
    };

    logger.log({ verbose: true }, 'Compiling lambda functions...');
    const compileSpinner = ora('Compiling lambda functions');
    compileSpinner.spinner = 'bouncingBar';
    compileSpinner.start();
    let successCount = 0;
    let invalidCount = 0;
    const successDirs: string[] = [];
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        const dirName = dir.substring(dir.lastIndexOf('/') + 1);
        try {
            if (!existsSync(join(dir, 'package.json'))) {
                logger.log({ verbose: true }, yellow(`Skipping ${dir}. Has no package.json`));
                invalidCount++;
                continue;
            }
            compileSpinner.start();
            compileSpinner.text = `Compiling ${dirName}`;
            logger.log({ verbose: true }, await execAsync(`yarn install`, dir));
            // Check if ts
            if (existsSync(join(dir, 'tsconfig.json'))) {
                logger.log({ verbose: true }, `${dirName} looks like a Typescript project`);
            }
            // If ts, compile ts
            compileSpinner.stop();
            logger.log({ verbose: false }, green(`✔ ${dirName} compiled`));
            successCount++;
            successDirs.push(dir);
        } catch (error) {
            if (error === 'warning package.json: No license field') {
                compileSpinner.stop();
                logger.log({ verbose: false }, green(`✔ ${dirName} compiled`));
                successCount++;
                successDirs.push(dir);
            } else {
                compileSpinner.stop();
                logger.log({ verbose: true }, error);
                logger.log({ verbose: false }, red(`✖ ${dirName} failed`));
                if (i >= dirs.length) {
                    compileSpinner.start();
                }
            }
        }
    }
    if (successCount > 0) {
        compileSpinner.stopAndPersist({
            symbol: green('✔'),
            text: green(`Successfully compiled ${successCount}/${dirs.length - invalidCount} functions`),
        });
    } else {
        compileSpinner.stopAndPersist({
            symbol: red('✖'),
            text: red('Failed to compile lambda functions'),
        });
    }
    return successDirs;
};

const zipDirectories = async (dirs: string[], outputDir: string, logger: Log): Promise<boolean> => {
    const emptyDirectory = async (directory: string) => {
        try {
            const files = await readdir(directory);
            for (const file of files) {
                try {
                    unlink(join(directory, file));
                } catch (error) {
                    throw error;
                }
            }
        } catch (error) {
            throw error;
        }
    };

    logger.log({ verbose: true }, 'Emptying bundles directory...');
    try {
        await emptyDirectory(outputDir);
    } catch (error) {
        logger.log({ verbose: true }, yellow('Unable to empty bundles directory'));
    }
    logger.log({ verbose: true }, 'Zipping lambda directories...');
    if (!existsSync(outputDir)) {
        logger.log({ verbose: true }, "Bundle directory doesn't exist. Creating...");
        await mkdir(outputDir);
    }
    const zipSpinner = ora('Bundling lambda functions');
    zipSpinner.spinner = 'bouncingBar';
    zipSpinner.start();
    let successCount = 0;
    let invalidCount = 0;
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        const dirName = dir.substring(dir.lastIndexOf('/') + 1);
        try {
            if (!existsSync(join(dir, 'package.json'))) {
                logger.log({ verbose: true }, yellow(`Skipping ${dir}. Has no package.json`));
                invalidCount++;
                continue;
            }
            zipSpinner.start();
            zipSpinner.text = `Bundling ${dirName}`;
            const buffer = getZipOfFolder(dir);
            const blob = await buffer.generateAsync({ type: 'nodebuffer' });
            await writeFile(join(outputDir, `${dirName}.zip`), blob);
            zipSpinner.stop();
            logger.log({ verbose: false }, green(`✔ ${dirName} bundled`));
            successCount++;
        } catch (error) {
            zipSpinner.stop();
            logger.log({ verbose: false }, red(`✖ ${dirName} failed`));
            if (i >= dirs.length) {
                zipSpinner.start();
            }
        }
    }
    if (successCount > 0) {
        zipSpinner.stopAndPersist({
            symbol: green('✔'),
            text: green(`Successfully bundled ${successCount}/${dirs.length - invalidCount} functions`),
        });
    } else {
        zipSpinner.stopAndPersist({
            symbol: red('✖'),
            text: red('Failed to bundle lambda functions'),
        });
    }

    return true;
};

export { zipDirectories, buildLambdas };

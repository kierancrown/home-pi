#!/usr/bin/env node
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import Log from './utils/log';
import { dim, green, red, yellow } from 'chalk';
import { checkTerraformVersion, initEnv } from './helpers/terraform';
import { parseConfig } from './utils/config';
import { buildLambdas, zipDirectories } from './helpers/lambdas';
import { getDirectories } from './utils/zip';

const optionDefinitions: OptionDefinition[] = [
    { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
    { name: 'apply', type: Boolean, defaultValue: false },
    { name: 'plan', type: Boolean, defaultValue: false },
    { name: 'env', alias: 'e', type: String },
];

(async () => {
    const options = commandLineArgs(optionDefinitions);
    const logger = new Log({ verbose: (options?.verbose as boolean) || false });

    logger.log({ verbose: true }, `Working in directory ${__dirname}`);

    if (!options?.env && typeof options?.env !== 'string') {
        logger.log({ verbose: false }, red('No --env flag'), options.env);
        process.exit(0);
    } else {
        const env = options.env as string;
        if (!(env === 'dev' || env === 'test' || env === 'prod')) {
            logger.log({ verbose: false }, red('Invalid --env flag. Must be "dev" | "test" | "prod"'), options.env);
            process.exit(0);
        }
    }

    // Load config
    logger.log({ verbose: true }, 'Checking config...');
    const config = await parseConfig();
    if (!config) {
        logger.log({ verbose: false }, yellow('No config file found. Skipping build of lambdas/resolvers...'));
    }

    // Check if terraform is installed
    logger.log({ verbose: true }, 'Checking Terraform installation...');
    let tfVer = '0';
    try {
        tfVer = await checkTerraformVersion();
        logger.log({ verbose: false }, `Running ${tfVer}`);
    } catch {
        logger.log(
            { verbose: false },
            red('Terraform cannot be found. Please install terraform. https://www.terraform.io/downloads.html'),
        );
        process.exit(0);
    }

    // Build Lambdas
    if (config?.lambdas) {
        const foundDirs = getDirectories(config.lambdas.inputDir);
        await buildLambdas(foundDirs, logger);
        await zipDirectories(foundDirs, config.lambdas.outputDir, logger);
    } else {
        logger.log({ verbose: false }, yellow('Skipping lambda step due to missing config'));
    }

    // Build Resolvers

    // Init Terraform
    logger.log({ verbose: true }, 'Initialsing Terraform...');
    try {
        if ((await initEnv(options?.env, options?.verbose || false)) === true) {
            logger.log({ verbose: false }, green(`Initialised env ${options?.env}`));
        }
    } catch (error) {
        logger.log({ verbose: false }, red('Unable to initialise Terraform. Check AWS permissions'));
        if (options?.verbose) {
            logger.log({ verbose: false }, red(error));
        } else {
            logger.log({ verbose: false }, dim('To see more information about this error run in verbose mode'));
        }
    }

    if (
        (options?.plan === true || options?.apply === true) &&
        (options?.env !== 'dev' || options?.env !== 'test' || options?.env !== 'prod')
    ) {
        logger.log(
            { verbose: false },
            red(`You must specify a --env flag to ${options?.plan === true ? 'plan' : 'apply'}`),
        );
    }
})();

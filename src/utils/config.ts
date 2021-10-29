import Ajv from 'ajv';
import schema from '../schemas/config.json';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { red } from 'chalk';
import { config } from '../types/config';
import jsonSchema from 'ajv/lib/refs/json-schema-draft-06.json';

let sharedConfig: config;

const parseConfig = async (workingDir = './'): Promise<null | config> => {
    if (!existsSync(join(workingDir, '.deployconfig'))) {
        return null;
    }
    try {
        const readConfig = JSON.parse(await readFile(join(workingDir, '.deployconfig'), { encoding: 'utf8' }));
        if (await validateConfig(readConfig)) {
            sharedConfig = readConfig as config;
            return readConfig as config;
        } else {
            process.exit(0);
        }
    } catch (error) {
        return null;
    }
};

const validateConfig = async (config: unknown): Promise<boolean> => {
    const ajv = new Ajv();
    ajv.addMetaSchema(jsonSchema);
    const validator = ajv.compile(schema);
    const valid = validator(config);
    if (!valid) {
        if (validator.errors) {
            for (const error of validator.errors) {
                console.error(red(`config ${error.message}`));
            }
        }
        return false;
    } else {
        return valid;
    }
};

export { sharedConfig, parseConfig };

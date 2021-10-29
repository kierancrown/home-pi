import { exec } from 'child_process';

const checkTerraformVersion = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec('terraform -v', function (error, stdout, stderr) {
            if (error || stderr) reject(stderr || error);
            resolve(stdout.replace(/(\n.*)/gm, ''));
        });
    });
};

const initEnv = async (env: 'dev' | 'test' | 'prod', verbose = false): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        exec(`terraform init -reconfigure -backend-config=backend-${env}.tfbackend`, function (error, stdout, stderr) {
            if (error || stderr) reject(stderr || error);
            if (verbose) console.log(stdout);
            resolve(true);
        });
    });
};

const applyEnv = async (env: 'dev' | 'test' | 'prod', verbose = false): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        exec(`terraform apply -var-file="deploy-${env}.tfvars"`, function (error, stdout, stderr) {
            if (error || stderr) reject(stderr || error);
            if (verbose) console.log(stdout);
            if (stdout.toLowerCase().startsWith('terraform initialized in an empty directory')) {
                reject('Empty Terraform project');
            } else {
                resolve(true);
            }
        });
    });
};

export { checkTerraformVersion, initEnv, applyEnv };

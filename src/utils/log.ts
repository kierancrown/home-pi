interface Constructor {
    verbose: boolean;
}

interface Options {
    verbose: boolean;
}

class Log {
    private isVerbose = false;

    constructor(options: Constructor) {
        this.isVerbose = options.verbose;
    }

    log(options: Options, ...args: unknown[]): void {
        if (options.verbose && !this.isVerbose) return;
        console.log(...args);
    }
}

export default Log;

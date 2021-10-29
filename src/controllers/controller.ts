import { green, yellow } from 'chalk';
import { WebServer } from '../server';

class Controller {
    private name: string;
    server: WebServer;

    constructor(name: string) {
        this.name = name;
        this.server = WebServer.getInstance();
        console.log(`Registering controller ${name}`);
    }

    registerRoutes(callingFromChild = false): void {
        if (callingFromChild === false) {
            console.warn(yellow(`No routes registered for ${this.name}`));
            return;
        }
        console.warn(green(`Registered routes for ${this.name}`));
    }

    stopService(): boolean {
        console.log(`Unregistering controller ${this.name}`);
        return true;
    }
}

export { Controller };

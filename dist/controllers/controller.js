"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const chalk_1 = require("chalk");
const server_1 = require("../server");
class Controller {
    constructor(name) {
        this.name = name;
        this.server = server_1.WebServer.getInstance();
        console.log(`Registering controller ${name}`);
    }
    registerRoutes(callingFromChild = false) {
        if (callingFromChild === false) {
            console.warn((0, chalk_1.yellow)(`No routes registered for ${this.name}`));
            return;
        }
        console.warn((0, chalk_1.green)(`Registered routes for ${this.name}`));
    }
    stopService() {
        console.log(`Unregistering controller ${this.name}`);
        return true;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map
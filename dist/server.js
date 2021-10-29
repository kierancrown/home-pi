"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServer = void 0;
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
class WebServer {
    constructor() {
        this.startTime = new Date();
        this.app = (0, express_1.default)();
        this.app.get('/', (_, res) => {
            res.json({ uptime: this.getUptime() });
        });
    }
    static getInstance() {
        if (!WebServer.instance) {
            WebServer.instance = new WebServer();
        }
        return WebServer.instance;
    }
    getUptime() {
        return (0, moment_1.default)(this.startTime).fromNow(true);
    }
    startServer(port) {
        this.app.listen(port, () => {
            console.log(`server started at http://localhost:${port}`);
        });
    }
    registerRoute(type, path, callback) {
        switch (type) {
            case 'get':
                this.app.get(path, callback);
                break;
            case 'post':
            case 'put':
                break;
        }
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=server.js.map
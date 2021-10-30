"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServer = void 0;
const express_1 = __importStar(require("express"));
const moment_1 = __importDefault(require("moment"));
class WebServer {
    constructor() {
        this.startTime = new Date();
        this.app = (0, express_1.default)();
        this.app.get('/', (_, res) => {
            res.json({ uptime: this.getUptime() });
        });
        this.app.use((0, express_1.urlencoded)({ extended: true }));
        this.app.use((0, express_1.json)());
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
                this.app.post(path, callback);
                break;
            case 'put':
                this.app.put(path, callback);
                break;
        }
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=server.js.map
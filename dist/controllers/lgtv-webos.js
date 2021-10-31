"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebOSController = void 0;
const controller_1 = require("./controller");
const lgtv2_1 = __importDefault(require("lgtv2"));
const chalk_1 = require("chalk");
const utils_1 = require("../utils");
const ws_1 = __importDefault(require("ws"));
class WebOSController extends controller_1.Controller {
    constructor(tvIP) {
        super('LG WebOS TV');
        this.isConnected = false;
        this.tvIP = tvIP;
        this.registerRoutes();
        this.discoverTv();
    }
    registerRoutes() {
        super.registerRoutes(true);
        this.server.registerRoute('post', '/lgtv/app/launch', (req, res) => {
            if (!this.tvController) {
                res.json({ error: 'LG TV is offline' });
                return;
            }
            const body = req.body;
            if (typeof body['app-id'] !== 'string') {
                res.json({ error: '"app-id" property missing from request' });
                return;
            }
            this.tvController.request('ssap://system.launcher/launch', { id: body['app-id'] }, (err, result) => {
                if (err) {
                    res.json({ error: err.message });
                }
                else {
                    res.json({
                        error: false,
                        result,
                    });
                }
            });
        });
        this.server.registerRoute('post', '/lgtv/toast/create', (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!this.tvController) {
                res.json({ error: 'LG TV is offline' });
                return;
            }
            const body = req.body;
            if (typeof body['message'] !== 'string') {
                res.json({ error: '"message" property missing from request' });
                return;
            }
            try {
                const result = yield this.displayMessage(body['message']);
                res.json({
                    error: false,
                    result,
                });
            }
            catch (error) {
                res.json({ error });
            }
        }));
    }
    displayMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                (_a = this.tvController) === null || _a === void 0 ? void 0 : _a.request('ssap://system.notifications/createToast', { message }, (err, res) => {
                    if (err)
                        reject(err);
                    else
                        resolve(res);
                });
            });
        });
    }
    onConnect() {
        console.log('Connected to LG TV');
        this.displayMessage('Connected to Home Pi');
    }
    connectToTv() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected === false)
                return;
            this.tvController = new lgtv2_1.default({ url: `ws://${this.tvIP}:3000` });
            this.tvController.on('connect', this.onConnect.bind(this));
            this.tvController.on('error', (err) => {
                if (err.message.startsWith('connect ETIMEDOUT')) {
                    this.isConnected = false;
                    this.discoverTv();
                }
                console.warn(chalk_1.yellow(err.message));
            });
        });
    }
    discoverTv() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected)
                return;
            console.log('Looking for LG TV');
            const ip = this.tvIP;
            const ws = new ws_1.default(`ws://${this.tvIP}:3000`, { handshakeTimeout: 1000 });
            const setIsConnected = () => {
                this.isConnected = true;
                this.connectToTv();
            };
            ws.on('open', function open() {
                console.log(`Found LG TV @ ${ip}:3000`);
                setIsConnected();
                ws.close();
            });
            ws.on('error', () => __awaiter(this, void 0, void 0, function* () {
                yield utils_1.waitFor(1000);
                yield this.discoverTv();
            }));
        });
    }
}
exports.WebOSController = WebOSController;
//# sourceMappingURL=lgtv-webos.js.map
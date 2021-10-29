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
exports.HueController = void 0;
const controller_1 = require("./controller");
const axios_1 = __importDefault(require("axios"));
class HueController extends controller_1.Controller {
    constructor(BridgeIP, authKey) {
        super('Hue');
        this.discoveredLights = [];
        this.bridgeIP = BridgeIP;
        this.baseUrl = `http://${BridgeIP}/api/${authKey}`;
        this.registerRoutes();
        this.discoverLights();
    }
    registerRoutes() {
        super.registerRoutes(true);
        this.server.registerRoute('get', '/hue/status', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json({
                status: 'Online',
                bridgeIP: this.bridgeIP,
                lights: this.discoveredLights,
            });
        });
        this.server.registerRoute('get', '/hue/lights', (req, res) => {
            res.send('Hello ');
        });
    }
    discoverLights() {
        return __awaiter(this, void 0, void 0, function* () {
            const lights = yield this.getLights();
            for (const id in lights) {
                this.discoveredLights.push(Object.assign({ id }, lights[id]));
            }
        });
    }
    getLights() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.baseUrl}/lights`);
            if (res.status === 200)
                return res.data;
            else
                return {};
        });
    }
    changeLightState(id, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.put(`${this.baseUrl}/lights/${id}/state`, JSON.stringify(state));
            if (res.status === 200)
                return res.data;
            else
                return { error: res.statusText, status: res.status };
        });
    }
}
exports.HueController = HueController;
//# sourceMappingURL=hue.js.map
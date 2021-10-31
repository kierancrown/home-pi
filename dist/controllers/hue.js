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
            res.setHeader('Content-Type', 'application/json');
            res.json(this.discoveredLights);
        });
        this.server.registerRoute('get', '/hue/light/:id', (req, res) => {
            const innerReq = req;
            const id = innerReq.params.id;
            const light = this.discoveredLights.find((light) => light.id === id);
            res.setHeader('Content-Type', 'application/json');
            res.json(light || { error: 'Light cannot be found' });
        });
        this.server.registerRoute('put', '/hue/lights/state', (req, res) => {
            const body = req.body;
            if (Array.isArray(body)) {
                body.forEach((b) => {
                    this.changeLightState(b.id, Object.assign({}, b.state));
                });
            }
            else
                this.changeLightState(body.id, Object.assign({}, body.state));
            res.json(this.discoveredLights);
        });
    }
    discoverLights() {
        return __awaiter(this, void 0, void 0, function* () {
            const lights = yield this.getLights();
            if (Object.keys(lights).length)
                this.discoveredLights = [];
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
            if (res.status === 200) {
                yield this.discoverLights();
                return res.data;
            }
            else
                return { error: res.statusText, status: res.status };
        });
    }
}
exports.HueController = HueController;
//# sourceMappingURL=hue.js.map
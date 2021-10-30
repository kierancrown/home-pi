import { Controller } from './controller';
import axios from 'axios';
import { Light, Lights } from '../types/hue';
import { Request } from 'express';

class HueController extends Controller {
    private baseUrl: string;
    private bridgeIP: string;
    discoveredLights: Light[] = [];

    constructor(BridgeIP: string, authKey: string) {
        super('Hue');
        this.bridgeIP = BridgeIP;
        this.baseUrl = `http://${BridgeIP}/api/${authKey}`;
        this.registerRoutes();
        this.discoverLights();
    }

    registerRoutes(): void {
        super.registerRoutes(true);
        // [GET] /hue/status route
        this.server.registerRoute('get', '/hue/status', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json({
                status: 'Online',
                bridgeIP: this.bridgeIP,
                lights: this.discoveredLights,
            });
        });
        // [GET] /hue/lights route
        this.server.registerRoute('get', '/hue/lights', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(this.discoveredLights);
        });
        interface IGetUserAuthInfoRequest extends Request {
            params: {
                id: string;
            }; // or any other type
        }
        // [GET] /hue/light/{id}
        this.server.registerRoute('get', '/hue/light/:id', (req, res) => {
            const innerReq = req as IGetUserAuthInfoRequest;
            const id = innerReq.params.id;
            const light = this.discoveredLights.find((light) => light.id === id);
            res.setHeader('Content-Type', 'application/json');
            res.json(light || { error: 'Light cannot be found' });
        });
        // [PUT] /hue/light/{id}
        this.server.registerRoute('put', '/hue/light/:id', (req, res) => {
            const body = req.body;
            if (Array.isArray(body)) {
                body.forEach((b) => {
                    this.changeLightState(b.id, { ...b.state });
                });
            } else this.changeLightState(body.id, { ...body.state });
            res.json(body);
        });
    }

    async discoverLights(): Promise<void> {
        const lights: Lights = await this.getLights();
        for (const id in lights) {
            this.discoveredLights.push({ id, ...lights[id] });
        }
        // log(`Discovered ${discoveredLights.length} lights`);
    }

    async getLights(): Promise<Lights> {
        // log("Discovering lights...");
        const res = await axios.get(`${this.baseUrl}/lights`);
        if (res.status === 200) return res.data;
        else return {};
    }

    async changeLightState(id: string, state: string): Promise<unknown> {
        // log(`Attempting to change light ${id} to state: ${JSON.stringify(state)}`);
        // log(`${baseUrl}/lights/${id}/state`);
        const res = await axios.put(`${this.baseUrl}/lights/${id}/state`, JSON.stringify(state));
        if (res.status === 200) return res.data;
        else return { error: res.statusText, status: res.status };
    }
}

export { HueController };

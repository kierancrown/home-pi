import { Controller } from './controller';
import axios from 'axios';
import { Light, Lights } from '../types/hue';
import { Request } from 'express';
import ping from 'ping';
import { waitFor } from '../utils';

class HueController extends Controller {
    private isConnected = false;
    private baseUrl: string;
    private bridgeIP: string;
    discoveredLights: Light[] = [];

    constructor(BridgeIP: string, authKey: string) {
        super('Hue');
        this.bridgeIP = BridgeIP;
        this.baseUrl = `http://${BridgeIP}/api/${authKey}`;
        this.registerRoutes();
        this.discoverBridge();
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
        // [PUT] /hue/lights/state
        this.server.registerRoute('put', '/hue/lights/state', (req, res) => {
            const body = req.body;
            if (Array.isArray(body)) {
                body.forEach((b) => {
                    this.changeLightState(b.id, { ...b.state });
                });
            } else this.changeLightState(body.id, { ...body.state });
            res.json(this.discoveredLights);
        });
    }

    async discoverLights(): Promise<void> {
        const lights: Lights = await this.getLights();
        if (Object.keys(lights).length) this.discoveredLights = [];
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

    async discoverBridge(): Promise<void> {
        if (this.isConnected) return;
        const res = await ping.promise.probe(this.bridgeIP);
        if (res.alive === true) {
            this.isConnected = true;
            this.discoverLights();
        } else {
            await waitFor(1000);
            await this.discoverBridge();
        }
    }

    async changeLightState(id: string, state: string): Promise<unknown> {
        // log(`Attempting to change light ${id} to state: ${JSON.stringify(state)}`);
        // log(`${baseUrl}/lights/${id}/state`);
        const res = await axios.put(`${this.baseUrl}/lights/${id}/state`, JSON.stringify(state));
        if (res.status === 200) {
            await this.discoverLights();
            return res.data;
        } else return { error: res.statusText, status: res.status };
    }
}

export { HueController };

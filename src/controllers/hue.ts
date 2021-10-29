import { Controller } from './controller';
import axios from 'axios';
import { Lights } from '../types/hue';

class HueController extends Controller {
    private baseUrl: string;
    private bridgeIP: string;
    discoveredLights: unknown[] = [];

    constructor(BridgeIP: string, authKey: string) {
        super('Hue');
        this.bridgeIP = BridgeIP;
        this.baseUrl = `http://${BridgeIP}/api/${authKey}`;
        this.registerRoutes();
        this.discoverLights();
    }

    registerRoutes(): void {
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

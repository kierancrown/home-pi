import { Controller } from './controller';
import lgtv from 'lgtv2';
import { yellow } from 'chalk';
import { waitFor } from '../utils';
import WebSocket from 'ws';
import { WebOSToastResponse } from '../types/webos';
import { createMagicPacket } from 'wol';

class WebOSController extends Controller {
    private isConnected = false;
    private tvIP: string;
    private tvController: lgtv | undefined;

    constructor(tvIP: string) {
        super('LG WebOS TV');
        this.tvIP = tvIP;
        this.registerRoutes();
        this.discoverTv();
    }

    registerRoutes(): void {
        super.registerRoutes(true);
        // [POST] /lgtv/app/launch
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
                } else {
                    res.json({
                        error: false,
                        result,
                    });
                }
            });
        });
        // [POST] /lgtv/toast/create
        this.server.registerRoute('post', '/lgtv/toast/create', async (req, res) => {
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
                const result = await this.displayMessage(body['message']);
                res.json({
                    error: false,
                    result,
                });
            } catch (error) {
                res.json({ error });
            }
        });
    }

    async displayMessage(message: string): Promise<WebOSToastResponse> {
        return new Promise((resolve, reject) => {
            this.tvController?.request('ssap://system.notifications/createToast', { message }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    async turnOnTv(): Promise<void> {
        createMagicPacket("");
        return;
    }

    onConnect(): void {
        console.log('Connected to LG TV');
        this.displayMessage('Connected to Home Pi');
    }

    async connectToTv(): Promise<void> {
        if (this.isConnected === false) return;
        this.tvController = new lgtv({ url: `ws://${this.tvIP}:3000` });
        this.tvController.on('connect', this.onConnect.bind(this));
        this.tvController.on('error', (err) => {
            if (err.message.startsWith('connect ETIMEDOUT')) {
                this.isConnected = false;
                this.discoverTv();
            }
            console.warn(yellow(err.message));
        });
    }

    async discoverTv(): Promise<void> {
        if (this.isConnected) return;
        const ip = this.tvIP;
        const ws = new WebSocket(`ws://${this.tvIP}:3000`, { handshakeTimeout: 1000 });

        const setIsConnected = () => {
            this.isConnected = true;
            this.connectToTv();
        };

        ws.on('open', function open() {
            console.log(`Found LG TV @ ${ip}:3000`);
            setIsConnected();
            ws.close();
        });

        ws.on('error', async () => {
            await waitFor(1000);
            await this.discoverTv();
        });
    }
}

export { WebOSController };

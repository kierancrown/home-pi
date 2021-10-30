import * as dotenv from 'dotenv';
import { Controller } from './controller';
import { HueController } from './hue';
import { WebOSController } from './lgtv-webos';

async function initControllers(): Promise<Controller[]> {
    dotenv.config();
    const registeredControllers: Controller[] = [];

    if (typeof process.env.HUE_BRIDGE_IP === 'string' && typeof process.env.HUE_AUTH_KEY === 'string') {
        // Hue
        registeredControllers.push(new HueController(process.env.HUE_BRIDGE_IP, process.env.HUE_AUTH_KEY));
    }
    if (typeof process.env.WEBOS_TV_IP === 'string') {
        // LG Web OS TV
        registeredControllers.push(new WebOSController(process.env.WEBOS_TV_IP));
    }

    return registeredControllers;
}

export { initControllers };

import * as dotenv from 'dotenv';
import { Controller } from './controller';
import { HueController } from './hue';

async function initControllers(): Promise<Controller[]> {
    dotenv.config();
    const registeredControllers: Controller[] = [];

    if (typeof process.env.HUE_BRIDGE_IP === 'string' && typeof process.env.HUE_AUTH_KEY === 'string') {
        // Hue
        registeredControllers.push(new HueController(process.env.HUE_BRIDGE_IP, process.env.HUE_AUTH_KEY));
    }

    return registeredControllers;
}

export { initControllers };

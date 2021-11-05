import { yellow } from 'chalk';
import * as dotenv from 'dotenv';
import { initControllers } from './controllers';
import { discoverBridge } from './helpers/hue';
import { MongoDB } from './helpers/mongo';
import { WebServer } from './server';

async function main() {
    dotenv.config();
    console.log(await discoverBridge());
    const database = MongoDB.getInstance();
    // TEST
    if (process.env.MONGODB_URL && process.env.DB_NAME) {
        const connected = await database.connect(process.env.MONGODB_URL, process.env.DB_NAME);
        if (connected) {
            // Register device
            console.log(
                await database.registerDevice({
                    name: 'test bulb',
                    ip_address: '192.168.0.0',
                    mac_address: 'hello',
                    type: 'hue_bulb',
                }),
            );
            console.log(await database.listDevices());
            // Unregister device
            // console.log(await database.unregisterDevice('6182ae89a4bfc78e1f0a362a'));
        } else {
            console.warn(yellow('Not connected to db'));
        }
    }
    const server = WebServer.getInstance();
    server.startServer(Number(process.env.SERVER_PORT) || 3000);
    await initControllers();
}

main();

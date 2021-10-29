import * as dotenv from 'dotenv';
import { initControllers } from './controllers';
import { WebServer } from './server';

async function main() {
    dotenv.config();
    const server = WebServer.getInstance();
    server.startServer(Number(process.env.SERVER_PORT) || 3000);
    await initControllers();
}

main();

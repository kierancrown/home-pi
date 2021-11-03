import * as dotenv from 'dotenv';
import { initControllers } from './controllers';
import { MongoDB } from './helpers/mongo';
import { WebServer } from './server';

async function main() {
    dotenv.config();
    const database = MongoDB.getInstance();
    // TEST
    if (process.env.MONGODB_URL && process.env.DB_NAME) {
        await database.connect(process.env.MONGODB_URL, process.env.DB_NAME);
    }
    const server = WebServer.getInstance();
    server.startServer(Number(process.env.SERVER_PORT) || 3000);
    await initControllers();
}

main();

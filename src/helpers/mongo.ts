import { MongoClient, ObjectId } from 'mongodb';

interface Device {
    name: string;
    ip_address: string;
    type: 'hue_bridge' | 'hue_bulb' | 'webos_tv' | 'win_pc' | 'mac_pc';
}

interface RegisterDeviceResult {
    error: boolean;
    message?: string;
    id?: string;
}

interface UnregisterDeviceResult {
    error: boolean;
    message?: string;
    acknowledged?: boolean;
    deletedCount?: number;
}

class MongoDB {
    private static instance: MongoDB;
    private dbName = '';
    private client: MongoClient | null = null;
    private isConnected = false;

    connect(url: string, dbName: string): void {
        this.dbName = dbName;
        this.client = new MongoClient(url);
        this.connectToDb();
    }

    public static getInstance(): MongoDB {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }

        return MongoDB.instance;
    }

    private async connectToDb(): Promise<boolean> {
        if (!this.client) return false;
        try {
            // Use connect method to connect to the server
            await this.client.connect();
            console.log('Connected successfully to mongo db');
            this.isConnected = true;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async registerDevice(device: Device): Promise<RegisterDeviceResult> {
        if (!this.client || !this.isConnected) return { error: true, message: 'Not connected to database' };
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('devices');
            const result = await collection.insertOne(device);
            return { error: false, id: result.insertedId.toString() };
        } catch (error) {
            return { error: true, message: String(error) };
        }
    }

    async unregisterDevice(id: string): Promise<UnregisterDeviceResult> {
        if (!this.client || !this.isConnected) return { error: true, message: 'Not connected to database' };
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('devices');
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return { error: false, ...result };
        } catch (error) {
            return { error: true, message: String(error) };
        }
    }
}

export { MongoDB };

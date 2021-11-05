import { MongoClient, ObjectId } from 'mongodb';

interface Home {
    _id?: ObjectId;
    name: string;
    rooms: Room[];
}

interface Room {
    _id?: ObjectId;
    name: string;
    devices: Device[];
    type: 'Hue bulb' | 'Hue bridge' | 'WebOS TV' | 'IP Cam' | 'Ring doorbell';
}

interface User {
    _id?: ObjectId;
    username: string;
    password: string;
    last_login: number;
}

interface UserHash {
    _id?: ObjectId;
    user_id: string;
    hash: string;
}

interface History {
    _id?: ObjectId;
    action: string;
    timestamp: number;
    message?: string;
}

interface Device {
    _id?: ObjectId;
    name: string;
    type: 'hue_bridge' | 'hue_bulb' | 'webos_tv' | 'win_pc' | 'mac_pc' | 'ip_cam' | 'ring_doorbell';
    ip_address: string;
    mac_address: string;
}

interface InsertResult {
    error: boolean;
    message?: string;
    id?: string;
}

interface DeleteResult {
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

    async connect(url: string, dbName: string): Promise<boolean> {
        this.dbName = dbName;
        this.client = new MongoClient(url);
        return await this.connectToDb();
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

    // HOME COLLECTION
    async registerHome(homeName: string): Promise<InsertResult> {
        if (!this.client || !this.isConnected) return { error: true, message: 'Not connected to database' };
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('home');
            const exists = await collection.findOne({ name: homeName });
            if (exists === null) {
                const result = await collection.insertOne({ name: homeName, rooms: [] });
                return { error: false, id: result.insertedId.toString() };
            }
            return { error: true, message: `A home with the name "${homeName}" already exists` };
        } catch (error) {
            return { error: true, message: String(error) };
        }
    }

    async unregisterHome(id: string): Promise<DeleteResult> {
        if (!this.client || !this.isConnected) return { error: true, message: 'Not connected to database' };
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('home');
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return { error: false, ...result };
        } catch (error) {
            return { error: true, message: String(error) };
        }
    }

    async listHomes(): Promise<Home[]> {
        if (!this.client || !this.isConnected) return [];
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('home');
            const allHomes = await collection.find();
            return (await allHomes.toArray()) as Home[];
        } catch (error) {
            return [];
        }
    }

    // ROOM COLLECTION
    async registerRoom(room: Room): Promise<InsertResult> {
        if (!this.client || !this.isConnected) return { error: true, message: 'Not connected to database' };
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('rooms');
            const result = await collection.insertOne(room);
            return { error: false, id: result.insertedId.toString() };
        } catch (error) {
            return { error: true, message: String(error) };
        }
    }

    async unregisterRoom(id: string): Promise<DeleteResult> {
        if (!this.client || !this.isConnected) return { error: true, message: 'Not connected to database' };
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('rooms');
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return { error: false, ...result };
        } catch (error) {
            return { error: true, message: String(error) };
        }
    }

    async listRooms(): Promise<Room[]> {
        if (!this.client || !this.isConnected) return [];
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('home');
            const allRooms = await collection.find();
            return (await allRooms.toArray()) as Room[];
        } catch (error) {
            return [];
        }
    }

    // DEVICE COLLECTION
    async registerDevice(device: Device): Promise<InsertResult> {
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

    async unregisterDevice(id: string): Promise<DeleteResult> {
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

    async listDevices(): Promise<Device[]> {
        if (!this.client || !this.isConnected) return [];
        try {
            const db = this.client.db(this.dbName);
            const collection = db.collection('devices');
            const filter = await collection.find();
            return (await filter.toArray()) as Device[];
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

export { MongoDB };

import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import nocache from 'nocache';
import moment from 'moment';
import { MongoDB } from './helpers/mongo';

interface IGetUserAuthInfoRequest extends Request {
    params: {
        id: string;
    }; // or any other type
}

class WebServer {
    private static instance: WebServer;
    private app;
    private startTime: Date;

    private constructor() {
        this.startTime = new Date();
        this.app = express();
        this.app.get('/', (_, res) => {
            res.json({ uptime: this.getUptime() });
        });
        this.app.use(urlencoded({ extended: true }));
        this.app.use(json());
        this.app.use(cors());
        this.app.use(nocache());
        this.setupRoutes();
    }

    public static getInstance(): WebServer {
        if (!WebServer.instance) {
            WebServer.instance = new WebServer();
        }

        return WebServer.instance;
    }

    private getUptime(): string {
        return moment(this.startTime).fromNow(true);
    }

    public startServer(port: number): void {
        this.app.listen(port, () => {
            console.log(`server started at http://localhost:${port}`);
        });
    }

    public registerRoute(
        type: 'get' | 'post' | 'put',
        path: string,
        callback: (req: Request<unknown>, res: Response<unknown>) => void,
    ): void {
        switch (type) {
            case 'get':
                this.app.get(path, callback);
                break;
            case 'post':
                this.app.post(path, callback);
                break;
            case 'put':
                this.app.put(path, callback);
                break;
        }
    }

    private setupRoutes() {
        const database = MongoDB.getInstance();

        // [GET] /homes
        this.app.get('/homes', async (_, res) => {
            res.json(await database.listHomes());
        });

        // [GET] /home/:id
        this.app.get('/home/:id', async (req, res) => {
            const innerReq = req as IGetUserAuthInfoRequest;
            const id = innerReq.params.id;
            res.json(await database.homeInfo(id));
        });

        // [PUT] /home
        this.app.put('/home', async (req, res) => {
            const body = req.body;
            if (typeof body.name !== 'string' || body.name === '') {
                res.json({ error: true, message: 'Invalid home name' });
            } else {
                const dbRes = await database.registerHome(body.name);
                if (dbRes.error) {
                    res.json({ error: true, message: dbRes.message });
                } else {
                    res.json({ error: false, id: dbRes.id });
                }
            }
        });

        // [DELETE] /home
        this.app.delete('/home', async (req, res) => {
            const body = req.body;
            if (typeof body.id !== 'string' || body.id === '') {
                res.json({ error: true, message: 'id param missing' });
            } else {
                const dbRes = await database.unregisterHome(body.id);
                if (dbRes.error) {
                    res.json({ error: true, message: dbRes.message });
                } else {
                    res.json({ error: false, deletedCount: dbRes.deletedCount });
                }
            }
        });
    }
}

export { WebServer };

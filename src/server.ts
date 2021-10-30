import express, { Request, Response, json, urlencoded } from 'express';
import moment from 'moment';

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
}

export { WebServer };

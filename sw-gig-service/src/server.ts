import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from "@ductan2/sw-shared/src"
import { Application, NextFunction, Request, Response, json, urlencoded } from "express";
import hpp from "hpp";
import cors from "cors";
import { config } from "@gig/configs";
import compression from "compression";
import { elasticsearch } from "@gig/utils/elasticsearch";
import { verify } from "jsonwebtoken";
// import { rabbitMQ } from "@auth/queues/connection";
import { Channel } from "amqplib";
import { appRoutes } from "@gig/routes/index.routes";
import { rabbitMQ } from "./queues/connection";
const log = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'api-gig-service', 'debug');
const PORT = 4004;
export let gigsChannel: Channel | undefined;


export class GigsServer {
    private app: Application;
    constructor(_app: Application) {
        this.app = _app;
    }
    public start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.startElasticsearch();
        this.startQueue();
        this.errorMiddleware();
        this.startServer(this.app)
    }
    private async startQueue() {
        gigsChannel = await rabbitMQ.connect() as Channel;
    }

    private startElasticsearch() {
        elasticsearch.checkConnectElasticSearch();
    }
    private securityMiddleware(_app: Application) {
        _app.set('trust proxy', 1); // trust first proxy 
        _app.use(hpp()); // protect against HTTP Parameter Pollution attacks
        _app.use(cors({ origin: `${config.API_GATEWAY_URL}`, credentials: true }));
        _app.use((req: Request, _res: Response, next: NextFunction) => {
            if (req.headers.authorization) { // bearer token
                const token = req.headers.authorization.split(' ')[1];
                const payload = verify(token, `${config.JWT_TOKEN}`) as IAuthPayload;
                req.currentUser = payload;
            }
            next();
        })
    }
    private standardMiddleware(_app: Application) {
        _app.use(compression())
        _app.use(json({ limit: '200mb' }))
        _app.use(urlencoded({ limit: '200mb', extended: true }))
    }
    private routesMiddleware(_app: Application) {
        appRoutes(_app);
    }
    private errorMiddleware() {
        this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
            const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            log.log('error', `${url} not found`);
            res.status(404).json({ message: 'The endpoint does not exist' })
            next();
        })
        this.app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
            log.error(error);
            if (error instanceof CustomError) {
                res.status(error.statusCode).json(error.serializeErrors());
            }
            next();
        });
    }
    private startServer(_app: Application) {
        try {
            _app.listen(PORT, () => {
                log.info(`Gateway Server is running on port ${PORT} with process id ${process.pid}`);
            })
        } catch (error) {
            log.log('error', 'Gateway Error starting server', error);
        }
    }
}

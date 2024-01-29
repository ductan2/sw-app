// config.ts
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'
dotenv.config(); // Load environment variables from .env

class Config {
    public ENABLE_APM: string | undefined;
    public NODE_ENV: string | undefined;
    public GATEWAY_JWT_TOKEN: string | undefined;
    public JWT_TOKEN: string | undefined;
    public API_GATEWAY_URL: string | undefined;
    public SENDER_EMAIL: string | undefined;
    public SENDER_EMAIL_PASSWORD: string | undefined;
    public MYSQL_DB: string | undefined;
    public CLOUD_NAME: string | undefined;
    public CLOUD_API_KEY: string | undefined;
    public CLOUD_API_SECRET: string | undefined;
    public RABBITMQ_ENDPOINT: string | undefined;
    public ELASTICSEARCH_URL: string | undefined;
    public ELASTIC_APM_SERVER_URL: string | undefined;
    public CLIENT_URL: string | undefined;
    public DATABASE_URL: string | undefined;
    constructor() {
        this.ENABLE_APM = process.env.ENABLE_APM || '0';
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN;
        this.JWT_TOKEN = process.env.JWT_TOKEN;
        this.API_GATEWAY_URL = process.env.API_GATEWAY_URL;
        this.SENDER_EMAIL = process.env.SENDER_EMAIL;
        this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
        this.MYSQL_DB = process.env.MYSQL_DB;
        this.CLOUD_NAME = process.env.CLOUD_NAME;
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT;
        this.ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
        this.ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL;
        this.DATABASE_URL = process.env.DATABASE_URL;
    }
    public cloudinaryConfig = () => {
        cloudinary.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.CLOUD_API_KEY,
            api_secret: this.CLOUD_API_SECRET
        });
    }


}

export const config: Config = new Config();

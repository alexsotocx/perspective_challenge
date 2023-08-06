import express from 'express';
import cors from 'cors';
import { IConfig } from './types/config';
import { createUsersRoute } from './api/routes/users';
import { MongoUsersRepository } from './repositories/mongodb/users';
import * as mongoose from 'mongoose';
import { logger } from './util/logger';

export class Api {
    constructor(private readonly config: IConfig) {}

    async start(): Promise<void> {
        const app = express();

        const connection = await mongoose.connect(this.config.mongoDbURI, {
            authSource: 'admin',
        });

        logger.info('Connected to mongodb', {
            connection: connection.connection.host,
            port: connection.connection.port,
            db: connection.connection.db.databaseName,
        });

        app.use(cors()).use(express.json()).options('*', cors());

        const usersRepository = new MongoUsersRepository(connection, null);

        app.use(createUsersRoute(usersRepository));

        app.listen(this.config.http.port, () => {
            logger.info(`[server]: Server is running at http://localhost:${this.config.http.port}`);
        });
    }
}

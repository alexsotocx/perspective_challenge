import * as dotenv from 'dotenv';
const loadedEnv = dotenv.config();

import { Api } from '../api';
import { IConfig } from '../types/config';
import { logger } from '../util/logger';

async function startApi(): Promise<void> {
    logger.debug('Config', loadedEnv);
    const config: IConfig = {
        http: {
            port: parseInt(process.env.PORT) || 9000,
        },
        mongoDbURI: process.env.MONGO_DB_URL,
    };
    const api = new Api(config);

    await api.start();
}

void startApi();

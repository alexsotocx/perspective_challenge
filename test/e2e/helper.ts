import { ClientSession, Mongoose } from 'mongoose';
import express, { Router } from 'express';
import supertest, { SuperTest, Test } from 'supertest';
import cors from 'cors';

export async function executeInTransaction(mongoose: Mongoose, cb: (session: ClientSession) => Promise<void>) {
    let session: ClientSession;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        await cb(session);
    } finally {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
    }
}

export function createTestRoute(router: Router): SuperTest<Test> {
    const app = express();

    app.use(cors()).use(express.json()).options('*', cors());

    app.use(router);
    return supertest(app);
}

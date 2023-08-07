import mongoose, { Mongoose } from 'mongoose';
import { createTestRoute } from './helper';
import { createUsersRoute } from '../../src/api/routes/users';
import { MongoUsersRepository } from '../../src/repositories/mongodb/users';
import { randomUUID } from 'crypto';
import { IGetAllUsersResponse } from '../../src/api/dto/responses/get-all-users';
import { afterAll, beforeAll, beforeEach, describe, test } from '@jest/globals';
import { SuperTest, Test } from 'supertest';
import { IUserCreatePayload } from '../../src/api/dto/requests/user-create';
import { userFixture } from '../fixtures';
import { Collections } from '../../src/repositories/mongodb/collections';
import { userSerializer } from '../../src/api/dto/serializers/user';

describe('/v1/users', () => {
    let db: Mongoose;
    let userRepo: MongoUsersRepository;
    let httpClient: SuperTest<Test>;

    beforeAll(async () => {
        db = await mongoose.connect(`mongodb://root:example@127.0.0.1:27017/test_users`, {
            authSource: 'admin',
        });

        userRepo = new MongoUsersRepository(db, Collections.Users);
        httpClient = createTestRoute(createUsersRoute(userRepo));
    });

    beforeEach(async () => {
        await db.connection.dropDatabase();
    });

    afterAll(async () => db.disconnect());

    describe('GET /', () => {
        test('Show all users ordered by last name', async () => {
            const u1 = await userRepo.save({
                email: 'email1@gmail.com',
                lastName: 'A',
                firstName: 'A',
                id: randomUUID(),
                createdAt: new Date(),
            });

            const u2 = await userRepo.save({
                email: 'email2@gmail.com',
                lastName: 'B',
                firstName: 'B',
                id: randomUUID(),
                createdAt: new Date(),
            });

            const response = await httpClient.get('/v1/users').query({order: 'desc'});
            expect(response.status).toEqual(200);
            const body: IGetAllUsersResponse = response.body;

            expect(body.totalItems).toEqual(2);
            expect(body.users[0]).toEqual(userSerializer(u2));
            expect(body.users[1]).toEqual(userSerializer(u1));
        });

        describe('with the created flag', () => {
            test('should return the items in created order', async () => {
                const u1 = await userRepo.save({
                    email: 'email1@gmail.com',
                    lastName: 'C',
                    firstName: 'C',
                    id: randomUUID(),
                    createdAt: new Date(),
                });

                const u2 = await userRepo.save({
                    email: 'email2@gmail.com',
                    lastName: 'A',
                    firstName: 'A',
                    id: randomUUID(),
                    createdAt: new Date(Date.now() - 1000),
                });

                const response = await httpClient.get('/v1/users').query({ created: '' });
                expect(response.status).toEqual(200);
                const body: IGetAllUsersResponse = response.body;

                expect(body.totalItems).toEqual(2);
                expect(body.users[0]).toEqual(userSerializer(u2));
                expect(body.users[1]).toEqual(userSerializer(u1));
            });
        });
    });

    describe('POST /', () => {
        test('creates user in the db', async () => {
            expect(await userRepo.getAllUsers()).toHaveLength(0);
            const response = await httpClient.post('/v1/users').send(<IUserCreatePayload>{
                email: userFixture.email,
                firstName: userFixture.firstName,
                lastName: userFixture.lastName,
            });

            expect(response.status).toEqual(201);
            const savedInDb = await userRepo.getAllUsers();
            expect(savedInDb).toHaveLength(1);
            expect(savedInDb[0]).toMatchObject({
                email: userFixture.email,
                firstName: userFixture.firstName,
                lastName: userFixture.lastName,
            });
        });

        describe('Validation error', () => {
            test('does not create user in the db', async () => {
                expect(await userRepo.getAllUsers()).toHaveLength(0);
                const response = await httpClient.post('/v1/users').send({
                    email: 'not an email',
                    firstName: 123,
                    lastName: userFixture.lastName,
                });

                expect(response.status).toEqual(400);
                const savedInDb = await userRepo.getAllUsers();
                expect(savedInDb).toHaveLength(0);
            });
        });
    });
});

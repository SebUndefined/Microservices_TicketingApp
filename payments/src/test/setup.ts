import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../app';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY = 'yourkeysecret';

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'abcdejf';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into json
    const sessionJSON = JSON.stringify(session);

    // take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string thats the cookies with the encoded data.
    return [`express:sess=${base64}`];
};

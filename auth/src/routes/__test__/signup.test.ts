import request from 'supertest';
import { app } from '../../app';

it('Returns a 201 on succesful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
});

it('Return a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@testfr',
            password: 'password',
        })
        .expect(400);
});

it('Return a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.fr',
            password: 'p',
        })
        .expect(400);
});

it('Return a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.fr',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password',
        })
        .expect(400);
});

it('It disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.fr',
            password: 'password',
        })
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.fr',
            password: 'password',
        })
        .expect(400);
});

it('Sets a cookie after succesful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.fr',
            password: 'password',
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});

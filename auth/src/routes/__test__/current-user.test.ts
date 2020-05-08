import request from 'supertest';
import { app } from '../../app';

it('Response with details about the current user', async () => {
    const cookie = await global.signin();
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send({
            email: 'test@test.fr',
            password: 'password',
        })
        .expect(200);
    expect(response.body.currentUser.email).toEqual('test@test.fr');
});

it('Response with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    expect(response.body.currentUser).toEqual(null);
});

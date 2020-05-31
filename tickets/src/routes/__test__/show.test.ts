import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('Returns a 404 if a ticket is not found', async () => {
    const response = await request(app).get('/api/tickets/123456AASS').send();
    console.log(response.body)
});

it('Returns the ticket if it is found', async () => {
    const title = 'Superman show';
    const price = 487.34;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price,
        })
        .expect(201);
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title,
            price,
        })
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});

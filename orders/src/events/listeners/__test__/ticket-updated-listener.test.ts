import { TicketUpdatedEvent } from '@sebundefinedtickets/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // Create an instance of the listener*
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'This is a title',
        price: 20,
    });
    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'This is a title updated',
        price: 10,
        userId: 'fdsfdsgfdgd',
    };
    // Create fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    return { listener, data, msg, ticket };
};

it('finds and update a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call the onMessage function with the data objetc + message object
    await listener.onMessage(data, msg);
    // Write assertion to make sure a ticket is updated
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('Ack the message', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call the onMessage function with the data objetc + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it('Does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener, ticket } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (error) {}
    expect(msg.ack).not.toHaveBeenCalled();
});

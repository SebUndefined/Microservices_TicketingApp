import {
    Listener,
    OrderCancelledEvent,
    Subjects,
} from '@sebundefinedtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        // If no ticket, throw error
        if (!ticket) {
            throw new Error('Ticket not found!');
        }
        // Mark the ticket as being reserved by setting its order id prop
        ticket.set({ orderId: undefined });
        // Save ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        });
        // ack message
        msg.ack();
    }
}
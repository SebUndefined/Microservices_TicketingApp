import express, { Request, Response, request } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    NotAuthorizedError,
    NotFoundError,
    BadRequestError,
} from '@sebundefinedtickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title must be provided'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater that 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket')
        }
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });
        await ticket.save();
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });
        res.send(ticket);
    }
);

export { router as updateTicketRouter };

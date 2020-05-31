import express, { Request, Response, request } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    currentUser,
} from '@sebundefinedtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title must be provided'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater that 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        });
        await ticket.save();
        res.status(201).send(ticket)
    }
);

export { router as createTicketRouter };

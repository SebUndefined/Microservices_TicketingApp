import {
    Publisher,
    PaymentCreatedEvent,
    Subjects,
} from '@sebundefinedtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

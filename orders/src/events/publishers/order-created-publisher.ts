import { OrderCreatedEvent, Publisher, Subjects } from "@sebundefinedtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}


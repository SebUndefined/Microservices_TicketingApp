import { Publisher, Subjects, OrderCancelledEvent } from "@sebundefinedtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
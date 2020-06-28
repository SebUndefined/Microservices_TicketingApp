import { Publisher, TicketCreatedEvent, Subjects, TicketUpdatedEvent } from "@sebundefinedtickets/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}
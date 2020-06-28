import { Publisher, TicketCreatedEvent, Subjects } from "@sebundefinedtickets/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}
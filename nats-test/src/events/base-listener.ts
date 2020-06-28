import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}



export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    private client: Stan;
    protected ackWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return (
            this.client
                .subscriptionOptions()
                // setManualAckMode we have to run some processing to inform NATS that everything is fine. Otherwise NATS will send it back 30 sec later
                .setManualAckMode(true)
                // setDeliverAllAvailable get the event saved by NATS previously. Cool but can be messy after weeks or month of use :)
                .setDeliverAllAvailable()
                // Number of second before a message is unacked
                .setAckWait(this.ackWait)
                // setDurableName make sure we do not send same message several time to same service. As sson as it's acked, the message will never be send again
                .setDurableName('account-service')
        );
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message Received: ${this.subject} / ${this.queueGroupName}`
            );
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data == 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}
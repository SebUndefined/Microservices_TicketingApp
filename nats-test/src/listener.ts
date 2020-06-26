import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // Action à la fermeture du programme
    stan.on('close', () => {
        console.log('NATS connxion closed');
        process.exit();
    });
    // setManualAckMode we have to run some processing to inform NATS that everything is fine. Otherwise NATS will send it back 30 sec later
    const options = stan.subscriptionOptions()
    // setManualAckMode we have to run some processing to inform NATS that everything is fine. Otherwise NATS will send it back 30 sec later
    .setManualAckMode(true)
    // setDeliverAllAvailable get the event saved by NATS previously. Cool but can be messy after weeks or month of use :)
    .setDeliverAllAvailable()
    // setDurableName make sure we do not send same message several time to same service. As sson as it's acked, the message will never be send again
    .setDurableName('account-service');


    const subscription = stan.subscribe(
        'ticket:created',
        // Queue group. Durable subscription is based on the durable name and the queue group. As soon as a queue group got the message, it's not sent again
        'account-service-queue-group',
        options
    );

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(
                `Received event #${msg.getSequence()} with data: ${data}`
            );
        }
        msg.ack();
    });
});

// Action à effectuer avant de terminer le process, en gros, informer que nous ne sommes plus en ligne au NATS
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


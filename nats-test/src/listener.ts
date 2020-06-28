import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

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

    new TicketCreatedListener(stan).listen();


});

// Action à effectuer avant de terminer le process, en gros, informer que nous ne sommes plus en ligne au NATS
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




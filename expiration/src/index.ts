import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER) {
        throw new Error('NATS_CLUSTER must be defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        // Action à la fermeture du programme
        natsWrapper.client.on('close', () => {
            console.log('NATS connexion closed');
            process.exit();
        });
        // Action à effectuer avant de terminer le process, en gros, informer que nous ne sommes plus en ligne au NATS
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
    } catch (err) {
        console.log(err);
    }
};

start();

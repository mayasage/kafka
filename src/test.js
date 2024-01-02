import Kafka from './lib/kafka.js';
import { promisify } from 'util';

const kafka = new Kafka({
  clientId: 'app1',
  brokers: ['localhost:29092'],
});

const producer = await kafka.producer();

const setTimeoutP = promisify(setTimeout);

await producer.xsend({
  topic: 'aquarium',
  messages: ['DragonFish', 'GoldFish', 'Krila', 'Vitaar', 'Shurya'].map(
    (value) => ({ value })
  ),
});

await setTimeoutP(2000);

await producer.xsend({
  topic: 'aquarium',
  messages: ['DragonFish', 'GoldFish', 'Krila', 'Vitaar', 'Shurya'].map(
    (value) => ({ value })
  ),
});

producer.stopXTimer();

console.log('2s');
await setTimeoutP(2000);

console.log('2s');
await setTimeoutP(2000);

console.log('2s');
await setTimeoutP(2000);

console.log('2s');
await setTimeoutP(2000);

await producer.xsend({
  topic: 'aquarium',
  messages: ['DragonFish', 'GoldFish', 'Krila', 'Vitaar', 'Shurya'].map(
    (value) => ({ value })
  ),
});

console.log('2s');
await setTimeoutP(2000);

console.log('2s');
await setTimeoutP(2000);

console.log('2s');
await setTimeoutP(2000);

console.log('2s');
await setTimeoutP(2000);

console.log('2s');
await setTimeoutP(2000);

producer.resetXTimer();

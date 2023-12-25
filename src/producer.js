import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'app1',
  brokers: ['localhost:29092'],
});

const producer = kafka.producer();
await producer.connect();

await producer.send({
  topic: 'aquarium',
  messages: ['DragonFish', 'GoldFish', 'Krila', 'Vitaar', 'Shurya'].map(
    (value) => ({ value })
  ),
});
await producer.disconnect();

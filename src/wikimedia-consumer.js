import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'wikimedia-consumer',
  brokers: ['localhost:29092', 'localhost:39092'],
});

const consumer = kafka.consumer({ groupId: 'group4' });
await consumer.connect();
await consumer.subscribe({ topic: 'wikimedia-events', fromBeginning: true });

consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      topic: topic.toString(),
      partition: partition.toString(),
      value: message.value.toString(),
    });
  },
});

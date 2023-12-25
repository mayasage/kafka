import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'app2',
  brokers: ['localhost:29092'],
});

const consumer = kafka.consumer({ groupId: 'group1' });
await consumer.connect();
await consumer.subscribe({ topic: 'aquarium', fromBeginning: true });

consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      topic: topic.toString(),
      partition: partition.toString(),
      value: message.value.toString(),
    });
  },
});

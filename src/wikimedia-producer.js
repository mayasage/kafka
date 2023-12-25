import EventSource from 'eventsource';
import winston from 'winston';
import SnappyCodec from 'kafkajs-snappy';

import {
  Kafka,
  Partitioners,
  logLevel,
  CompressionTypes,
  // CompressionCodecs,
} from 'kafkajs';

import fullKafka from 'kafkajs'

fullKafka.CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

const toWinstonLogLevel = (level) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
  }
};

const WinstonLogCreator = (logLevel) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(logLevel),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'wikimedia-producer.log' }),
    ],
  });

  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;
    logger.log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    });
  };
};

const kafka = new Kafka({
  clientId: 'wikimedia',
  brokers: ['localhost:29092', 'localhost:39092'],
  requestTimeout: 30000,
  retry: {
    maxRetryTime: 1000 * 60 * 2, // retry for 2 mins at max
    retries: +Infinity,
  },
  logLevel: logLevel.INFO,
  logCreator: WinstonLogCreator,
});

const producer = kafka.producer({
  idempotent: true,
  maxInFlightRequests: 5,
  allowAutoTopicCreation: false,
  createPartitioner: Partitioners.DefaultPartitioner,
  retry: {
    maxRetryTime: 1000 * 60 * 2, // retry for 2 mins at max
  },
});
await producer.connect();

const es = new EventSource(
  'https://stream.wikimedia.org/v2/stream/recentchange'
);

es.onmessage = (event) => {
  producer.send({
    topic: 'wikimedia-events',
    messages: [{ value: event.data }],
    acks: -1,
    compression: CompressionTypes.Snappy,
  });
  producer.logger().info('sent')
};

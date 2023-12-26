import { Kafka as KafkaOG } from 'kafkajs';

/**
 * Tries to change the following into a Number:
 *   - String
 *
 * @param {String | Number} x
 * @returns {Number | undefined}
 */
export const convertToNumber = (x) => {
  let result;

  if (x === 0) {
    result = 0;
  } else if (x) {
    switch (typeof x) {
      case 'number': {
        result = x;
        break;
      }

      case 'string': {
        const _ = +x;

        if (!Number.isNaN(_)) {
          result = _;
        }
      }
    }
  }

  return result;
};

const allowedProperties = {
  xTimeout: 'Number',
  xBufferSize: 'Number',
};

const isPropertyValid = (property) =>
  allowedProperties.hasOwnProperty(property);

const isPropertyValueValid = (property, value) => {
  switch (allowedProperties[property]) {
    case 'Number': {
      const val = convertToNumber(value);
      if (!val) return false;
      break;
    }

    default:
      return false;
  }

  return true;
};

const addXsend = async (obj, producer) => {
  producer.xBuffer = [];
  producer.xBufferSize = obj.properties.xBufferSize;
  producer.xTimeout = obj.properties.xTimeout;

  const sendToKafka = async () => {
    try {
      if (producer.xBuffer.length <= 0) return;
      const _xBuffer = producer.xBuffer;
      producer.xBuffer = [];
      const resp = await producer.sendBatch(_xBuffer);
      console.log(`Response:`, resp);
      console.log(`Sent:`, _xBuffer);
      console.log(`Sent ${_xBuffer.length} messages successfully`);
    } catch (err) {
      console.error(err);
      console.info(`Could not send:`, _xBuffer);
      console.log(`Sending ${_xBuffer.length} messages failed`);
    }
  };

  let xTimer = setInterval(sendToKafka, producer.xTimeout);

  producer.xsend = async (msg) => {
    try {
      producer.xBuffer.push(msg);
      if (producer.xBuffer.length >= producer.xBufferSize) await sendToKafka();
    } catch (err) {
      console.error(err);
    }
  };

  producer.resetXTimer = (t = producer.xTimeout) => {
    clearInterval(xTimer);
    producer.xTimeout = t;
    xTimer = setInterval(sendToKafka, t);
  };

  producer.stopXTimer = () => clearInterval(xTimer);
};

const propertiesPreUpdateHooks = {
  set: function (target, property, value) {
    if (!isPropertyValid(property)) return false;
    if (!isPropertyValueValid(property, value)) return false;
    target[property] = value;
    return true;
  },
};

class Kafka extends KafkaOG {
  constructor(cfg = {}) {
    super(cfg);
    this.properties = new Proxy(Object.create(null), propertiesPreUpdateHooks);
    this.properties.xTimeout = 1000;
    this.properties.xBufferSize = 20;
  }

  set(props = {}) {
    this.properties = { ...this.properties, ...props };
  }

  async producer(cfg = {}) {
    const producer = super.producer(cfg);
    await producer.connect();
    addXsend(this, producer);
    return producer;
  }
}

export default Kafka;

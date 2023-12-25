---
runme:
  id: 01HJ6TCRGK65SKDF92EWQ594T0
  version: v2.0
---

# Concepts

## Defaults

- By default, the producer does not care what partition a specific message is
   written to and will balance messages over all partitions of a topic evenly.

## Why Apache Kafka ?

- Created by LinkedIn, now Open-Source Project mainly maintained by Confluent,
   IBM, Cloudera
- Distributed, resilient architecture, fault tolerant
- Horizontal scalability:

   - Can scale to 100s of broker
   - Can scale to millions of messages per second

- High performance (latency of less than 10ms) - real time
- Used by the 2000+ firms, 80% of the Fortune 100

## Apache Kafka: Use Cases

- Messaging System
- Activity Tracking
- Gather metrics from many different locations
- Application Logs gathering
- Stream processing (with the Kafka Streams API for example)
- De-coupling of system dependencies
- Integration with Spark, Flink, Storm, Hadoop, and many other Big Data
   technologies
- Micro services pub/sub

## Real-life Examples

- **Netflix** used Kafka to apply recommendations in real-time while you're
   watching TV shows
- **Uber** uses Kafka to gather user, taxi and trip data in real-time to compute
   and forecast demand, and compute surge pricing in real-time
- **LinkedIn** uses Kafka to prevent spam, collect user interactions to make
   better connection recommendations in real-time

## Kafka Ecosystem

- **Kafka Connect API:** Understand how to import/export data to/from Kafka
- **Kafka Stream API:** Learn how to process and transform data within Kafka
- **ksqlDB:** Write Kafka Streams applications using SQL
- **Confluent Components:** REST Proxy and Schema Registry
- **Kafka Security:** Setup Kafka security in a Cluster and Integrate your
   applications with Kafka Security
- **Kafka Monitoring and Operations:** use Prometheus and Grafana to monitor
   Kafka
- **Kafka Cluster Setup & Administration:** how Kafka & Zookeeper works, how to
   Setup Kafka and various administration tasks

## Kafka Topics

- Like a table in database (without all the constraints)
- A topic is identified by its *name*
- The sequence of message is called a *data stream*

## Partitions & Offsets

- Topics are split in *partitions*

   - Messages within each partition are ordered
   - Each message within a partition gets an incremental id, called *offset*

- Kafka topics are **immutable:** once data is written to a partition, it cannot
   be changed

## Topics, Partitions & Offsets - important notes

- Once data is written to a partition, *it cannot be changed* (immutability)
- Data is kept only for a limited time (default is one week - configurable)
- Offset only have a meaning for a specific partition.

   - E.g. offset 3 is partition 0 doesn't represent the same data as offset 3 in
      partition 1
   - Offsets are not re-used even if previous messages have been deleted

- Order is guaranteed only within a partition (not across partitions)
- Data is assigned randomly to a partition unless a key is provided

## Producers

- Producers write data to topics (which are made of partitions)
- Producers know to which partition to write to (and which Kafka broker has it)
- In case of Kafka broker failures, Producers will automatically recover
- The load is balanced to many brokers thanks to the number of partitions

## Producers: Message Keys

- Producers can choose to send a **key** with the message (string, number,
   binary, etc..)
- if key=*null*, data is sent round robin (partition 0, then 1, then 2...)
- if key!=*null*, then all messages for that key will always go to the same
   partition (hashing)
- A key are typically sent if you need message ordering for a specific field
   (ex: _truck_id_)

## Kafka Messages Anatomy

![kafka_message](./pics/kafka_message.png)

## Kafka Message Serializer

- Kafka only accepts bytes as input from producers and send bytes out as output
   to consumers
- Message Serialization means transforming objects/data into bytes
- They are used on the value and the key
- Common Serializers

   - String (incl. JSON)
   - Int, Float
   - Avro
   - Protobuf

![kafka_message_serializer](./pics/kafka_message_serializer.png)

## Kafka Message Key Hashing

- A Kafka partitioner is a code logic that takes a record and determines to
   which partition to send it into.
- **Key Hashing** is the process of determining the mapping of a key to a
   partition
- In the default Kafka partitioner, the keys are hashed using the **murmur2**
   **algorithm,** with the formula:

`targetPartition = Math.abs(Utils.murmur2(keyBytes)) % (numPartition - 1)`

## Consumers

- Consumers read data from a topic (identified by name) - pull model
- Consumers automatically know which broker to read from
- In case of broken failures, consumers know how to recover
- Data is read in order from low to high offset **within each partitions**

## Consumer Deserializer

- Deserializer indicates how to transform bytes into objects/data
- They are used on the value and the key of the message
- Common Deserializers

   - String (incl. JSON)
   - Int, Float
   - Avro
   - Protobuf

- The serialization/deserialization type must not change during a topic
   lifecycle (create a new topic instead)

![consumer_deserialization](./pics/consumer_deserialization.png)

## Consumer Groups

- All the consumers in an application read data as a consumer groups
- Each consumer within a group reads from exclusive partitions

![consumer_groups](./pics/consumer_groups.png)

## Consumer Groups - What if too many consumers ?

If you have more consumers than partitions, some consumers will be inactive

## Multiple Consumers on one topic

- In Apache Kafka it is acceptable to have multiple consumer groups on the same
   topic
- To create distinct consumer groups, use the consumer property **group.id**

![multiple_consumers_on_one_topic](./pics/multiple_consumers_on_one_topic.png)

## Consumer Offsets

- **Kafka** stores the offsets at which a consumer group has been reading
- The offsets commited are in Kafka _topic_ named ___consumer_offsets_
- When a consumer in a group has processed data received from Kafka, it should
   be __periodically__ committing the offsets (the Kafka broker will write to
   ___consumer_offsets_, not the group itself)
- If a consumer dies, it will be able to read back from where it left off thanks
   to the committed consumer offsets!

![consumer_offsets](./pics/consumer_offsets.png)

## Delivery semantics for consumers

- By default, Java Consumers will automatically commit offsets (at least once)
- There are 3 delivery semantics if you choose to commit manually
- **At least once** (usually preferred)

   - Offsets are committed after the message is processed
   - If the processing goes wrong, the message will be read again
   - This can result in duplicate processing of messages. Make sure your
      processing is *idempotent* (i.e. processing the messages again won't impact
      your systems)

- **At most once**

   - Offsets are committed as soon as messages are received
   - If the processing goes wrong, some messages will be lost (they won't be
      read again)

- **Exactly once**

   - For Kafka => Kafka workflows: use the Transactional API (easy with Kafka
      Streams API)
   - For Kafka => External System workflows: use an *idempotent* consumer

## Kafka Brokers

- A Kafka cluster is composed of multiple brokers (servers)
- Each server is identified with its ID (integer)
- Each broker contains certain topic partitions
- After connecting to any broker (called a bootstrap broker), you will be
   connected to the entire cluster (Kafka clients have smart mechanics for that)
- A good number to get started is 3 brokers, but some big clusters have over
   100 brokers

## Brokers and Topics

- Data is distributed among the brokers
- A broker doesn't have all the data, but just the data that it should have
- The more brokers you add, the more the data will be distributed

## Kafka Broker Discovery

- Every Kafka broker is also called a "bootstrap server"
- That means that **you only need to connect to one broker**, and the Kafka
   clients will know how to be connected to the entire cluster (smart clients)
- Each broker knows about all brokers, topics and partitions (metadata)

![kafka_broker_discovery](./pics/kafka_broker_discovery.png)

## Topic Replication Factor

- Topics should have a replication factor > 1 (usually between 2 and 3)
- This way if a broker is down, another broker can serve the data
- Example: Topic-A with 2 partitions and replication factor of 2

![topic_replication_factor](./pics/topic_replication_factor.png)

## Concept of Leader for a Partition

- **At any time only ONE broker can be a leader for a given partition**
- **Producers can only send data to the broker that is leader of a partition**
- The other brokers will replicate the data
- Therefore, each partition has one leader and multiple ISR (in-sync replica)

![leader_for_a_partition](./pics/leader_for_a_partition.png)

## Default producer & consumer behaviour with leaders

- Kafka Producers can only write to the leader broker for a partition
- Kafka Consumers by default will read from the leader broker for a partition

## Kafka Consumer Replica Fetching (Kafka v2.4+)

- Since Kafka 2.4, it is possible to configure consumers to read from the
   closest replica
- This may help improve latency, and also decrease network costs if using the
   cloud

## Producer Acknowledgements

- Producer can choose to receive acknowledgement of data writes:

   - `acks=0`: Producer won't wait for acknowledgement (possible data loss)
   - `acks=1`: Producer will wait for leader acknowledgement (limited data loss)
   - `acks=all|-1`: Leader + replicas acknowledgement (no data loss)

- `acks=all` goes with `min.insync.replicas`

   - The leader replica for a partition checks to see if there are enough in-sync
      replicas for safely writing the message (controlled by the broker setting
      `min.insync.replicas`)

      - `min.insync.replicas=1`: only the broker leader needs to successfully ack
      - `min.insync.replicas=2`: at least the broker leader and one replica need
         to ack

- Sensible values should be a replication factor of 3, and min.insync.replicas
   of 2

## Kafka Topic Durability

- For a topic replication factor of 3, topic data durability can withstand 2
   brokers loss
- As a rule, for a replication factor of N, you can permanently lose up to N - 1
   brokers and still recover your data

## Kafka Topic Availability

- **Availability: (considering `RF=3`)**

   - `acks=0` & `acks=1`: if one partition is up and considered an ISR, the topic
      will be available for writes
   - `acks=all`:

      - `min.insync.replicas=1` (default): the topic must have at least 1
         partition up as an ISR (that includes the leader) and so we can tolerate
         two brokers going down
      - `min.insync.replicas=2`: the topic must have at least 2 ISR up, and
         therefore we can tolerate at most one broker being down (in the case of
         replication factor of 3), and we have the guarantee that for every write,
         the data will be at least written twice
      - `min.insync.replicas=3`: this wouldn't make much sense for a corresponding
         replication factor of 3 and we couldn't tolerate any broker going down
      - in summary, when `acks=all` with a `replication.factor=N` and
         `min.insync.replicas=M` we can tolerate N-M brokers going down for topic
         availability purposes

- `acks=all` and `min.insync.replicas=2` is the most popular option for data
   durability and availability and allows you to withstand at most the loss of
   **one** Kafka broker

## Zookeeper

- Zookeeper manages brokers (keeps a list of them)
- Zookeeper helps in performing leader election for partitions
- Zookeeper sends notifications to Kafka in case of changes (e.g. new topic,
   broker dies, broker comes up, delete topics, etc...)
- **Kafka 2.x can't work without Zookeeper**
- **Kafka 3.x can work without Zookeeper (KIP-500) - using Kafka Raft instead**
- **Kafka 4.x will not have Zookeeper**
- Zookeeper by design operates with an odd number of servers (1, 3, 5, 7)
- Zookeeper has a leader (writes) the rest of the servers are followers (reads)
- (Zookeeper does NOT store consumer offsets with Kafka > 0.10)

## Zookeeper Cluster

![zookeeper_cluster](./pics/zookeeper_cluster.png)

## Should YOU use Zookeeper ?

- **With Kafka Brokers?**

   - Yes, until Kafka 4.0 is out while waiting for Kafka without Zookeeper to be
      production-ready

- **With Kafka Clients?**

   - Over time, the Kafka clients and CLI have been migrated to leverage the
      brokers as a connection endpoint instead of Zookeeper
   - Since Kafka 0.10, consumers store offset in Kafka and Zookeeper and must not
      connect to Zookeeper as it is deprecated
   - Since Kafka 2.2, the `kafka-topics.sh` CLI command references Kafka brokers
      and not Zookeeper for topic management (creation, deletion, etc...) and the
      Zookeeper CLI argument is deprecated
   - All the APIs and commands that were previously leveraging Zookeeper are
      migrated to use Kafka instead, so that when clusters are migrated to be
      without Zookeeper, the change is invisible to clients
   - Zookeeper is also less secure than Kafka, and therefore Zookeeper ports
      should be opened to allow traffic from Kafka brokers, and not Kafka clients
   - Therefore, to be a great modern-day Kafka developer, never ever use
      Zookeeper as a configuration in your Kafka clients, and other programs that
      connect to Kafka

## About Kafka KRaft

- In 2020, the Apache Kafka project started to work to remove the Zookeeper
   dependency from it (KIP-500)
- Zookeeper shows scaling issues when Kafka clusters have > 100000 partitions
- By removing Zookeeper, Apache Kafka can

   - Scale to millions of partitions, and becomes easier to maintain and set-up
   - Improve stability, makes it easier to monitor, support and administer
   - Single security model for the whole system
   - Single process to start with Kafka
   - Faster controller shutdown and recovery time

- Kafka 3.X now implements the Raft protocol (KRaft) in order to replace
   Zookeeper

   - Production ready since Kafka 3.3.1 (KIP-833)
   - Kafka 4.0 will be released only with KRaft (no Zookeeper)

## Kafka KRaft Architecture

![kafka_kraft_architecture](./pics/kafka_kraft_architecture.png)

## KRaft Performance Improvements

![kraft_performance_improvements](./pics/kraft_performance_improvements.png)

## Consumer Groups and Partition Rebalance

When a new Consumer join a Group, how does the Partitions change ?

- **Eager Rebalancing**

   - All consumers stop, give up their membership of partitions
   - They rejoin the consumer group and get a new partition assignment
   - During a short period of time, the entire consumer group stops processings
   - Consumers don't necessarily "get back" the same partitions they used to

- **Cooperative Rebalance (Incremental Rebalance)**

   - Reassigning a small subset of the partitions from one consumer to another
   - Other consumers that don't have reassigned partitions can still process
      uninterrupted
   - Can go through several iteration to find a "stable" assignment (hence
      "incremental")
   - Avoids "stop-the-world" events where all consumers stop processing data

## Cooperative Rebalance

Note: the first 3 in Kafka Consumer are "stop-the-world".

- **Kafka Consumer:** `partition.assignment.strategy`

   - **RangeAssignor:** assign partitions on a per-topic basis (can lead to
      imbalance)
   - **RoundRobin:** assign partitions across all topics in round-robin fashion,
      optimal balance
   - **StickyAssignor:** balanced like RoundRobin, then minimizes partition
      movements when consumer join/leave the group in order to minimize movements
   - **CoperativeStickyAssignor:** rebalance strategy is identical to
      StickyAssignor but supports cooperative rebalances and therefore consumers
      can keep on consuming from the topic
   - **The default assignor is [RangeAssignor, CoperativeStickyAssignor]**, which
      will use the RangeAssignor by default, but allows upgrading to the
      CooperativeStickyAssignor with just a single rolling bounce that removes
      the RangeAssignor from the list.

- **Kafka Connect:** already implemented (enabled by default)
- **Kafka Streams:** turned on by default using StreamsPartitionAssignor

## Static Group Membership

- By default, when a Consumer leaves a Group, its partitions are revoked and
   reassigned
- If it joins back, it will have a new "member ID" and new partitions assigned
- If you specify `group.instance.id` it makes the consumer a **static member**
- Upon leaving, the consumer has up to `session.timeout.ms` to join back and get
   back its partitions (else they'll be reassigned), without triggering a
   rebalance
- This is helpful when consumers maintain a local state and cache (to avoid
   re-building the cache)

## Kafka Consumer - Auto Offset Commit Behaviour

- In Java Consumer API, offsets are regularly committed
- Enable at-least once reading scenario by default (under conditions)
- Offsets are committed when you call `.poll()` and `auto.commit.interval.ms`
   has elapsed
- Example: `auto.commit.interval.ms=5000` and `enable.auto.commit=true` will
   commit
- Make sure messages are all successfully processed before you call `poll()`
   again
- If you don't, you won't be in the at-least-once reading scenario
- In that (rare) case, you must disable `enable.auto.commit`, and most likely
   move processing to a separate thread, and then from time-to-time call
   `.commitSync()` or `.commitAsync()` with the correct offsets manually
   (advanced)

## Advance Kafka Consumer With Java

[Rebalance, seek and assign, consumer in thread](https://www.conduktor.io/kafka/advanced-kafka-consumer-with-java/)

## Anti Kafka

[reddit](https://www.reddit.com/r/devops/comments/x53x7v/ui_for_apache_kafka_an_opensource_tool_for/)

## Producer Retries

- In case of transient failures, developers are expected to handle exceptions,
  otherwise data will be lost

- Example of transient failure:
  - `NOT_ENOUGH_REPLICAS` (due to `min.insync.replicas` setting)

- There is a `retries` setting
  - defaults to 0 for Kafka <= 2.0
  - defaults to 2147483647 for Kafka >= 2.1

- The `retry.backoff.ms` setting is by default 100 ms

## Producer Timeout

- If `retries>0`, for example `retries=2147483647`, retries bounded by a timeout
- Since Kafka 2.1, you can set: `delivery.timeout.ms=120000==2min`

- Records will be failed if they can't be acknowledged within
  `delivery.timeout.ms`

## Producer Retries: Warning for old version of Kafka

- If you are not using an idempotent producer (not recommended - old Kafka):

  - In case of `retries`, there is a chance that messages will be sent out of
    order (if a batch has failed to be sent)

  - If you rely on key-based ordering, that can be issue

- For this, you can set the setting that controls how many produce requests can
  be made in parallel: `max.in.flight.requests.per.connection`
  - Default: 5
  - Set it to 1 if you need to ensure ordering (may impact throughput)

- In Kafka >= 1.0.0, there's a better solution with idempotent producers!

## Idempotent Producer

The Producer can introduce duplicate messages in Kafka due to network errors

![idempotent_producer](./pics/idempotent_producer.png)

In Kafka >= 0.11, you can define a "idempotent producer" which won't introduce
duplicates on network error

![idempotent_producer_2](./pics/idempotent_producer_2.png)

- Idempotent producers are great to guarantee a safe and stable pipeline!
- They are the default since Kafka 3.0, recommended to use them

- They come with:
  - retries=Integer.MAX_VALUE(2^31-1=2147483647)
  - `max.in.flight.requests=1` (Kafka == 0.11) or

  - `max.in.flight.requests=5` (Kafka >= 1.0 - higher performance & keep
    ordering - KAFKA-5494)

  - `acks=all`

- These settings are applied automatically after your producer has started if
  not manually set

- Just set:
  `producerProps.put("enable.idempotence", true)`

## Kafka Producer Defaults

- Since Kafka 3.0, the producer is "safe" by default:
  - `acks=all` (-1)
  - `enable.idempotence=true`

- With Kafka 2.8 and lower, the producer by default comes with:
  - `acks=1`
  - `enable.idempotence=false`

- I would recommend using a safe producer whenever possible!
- Super important: always use upgraded Kafka Clients

## Safe Kafka Producer - Summary

Since Kafka 3.0, the producer is "safe" by default, otherwise, upgrade your
client or set the following settings

- `acks=all`
  - Ensures data is properly replicated before an `ack` is received

- `min.insync.replicas=2` (broker/topic level)
  - Ensures 2 brokers in ISR at least have the data after an `ack`

- `enable.idempotence=true`
  - Duplicates are not introduced due to network retries

- `retries=MAX_INT` (producer level)
  - Retry until `delivery.timeout.ms` is reached

- `delivery.timeout.ms=120000`
  - Fail after retrying for 2 minutes

- `max.in.flight.requests.per.connection=5`
  - Ensure maximum performance while keeping message ordering

## Message Compression at the Producer level

- Producer usually sends data that is text-based, for example with JSON data
- In this case, it is important to apply compression to the producer

- Compression can be enabled at the Producer level and doesn't require any
  configuration change in the Brokers or the Consumers

- `compression.type` can be `none` (default), `gzip`, `lz4`, `snappy`, `zstd`
  (Kafka 2.1)

- Compression is more effective the bigger the batch of message being sent to
  Kafka!

- [Benchmark](https://blog.cloudflare.com/squeezing-the-firehose)

![message_compression_at_producer_level](./pics/message_compression_at_producer_level.png)

## Message Compression

- The compressed batch has the following advantages:
  - Much smaller producer request size (compression ratio up to 4x!)
  - Faster to transfer data over the network => less latency
  - Better throughput
  - Better disk utilization in Kafka (stored messages on disk are smaller)

- Disadvantages (very minor):
  - Producers must commit some CPU cycles to compression
  - Consumers must commit some CPU cycles to decompression

- Overall:

  - Consider testing `snappy` or `lz4` for optimal speed / compression ratio
    (test others too)

  - Consider tweaking `linger.ms` and `batch.size` to have bigger batches, and
    therefore more compression and higher throughput

  - Use compression in production

## Message Compression at the Broker / Topic level

- There is also a setting you can set at the broker level (all topics) or
  topic-level

- `compression.type=producer` (default), the broker takes the compressed batch
  from the producer client and writes it directly to the topic's log file
  without recompressing the data

- `compression.type=none`: all batches are decompressed by the broker

- `compression.type=lz4`: (for example)
  - If it's matching the producer setting, data is stored on disk as is

  - If it's a different compression setting, batches are decompressed by the
    broker and then re-compressed using the compression algorithm specified

- Warning: if you enable broker-side compression, it will consume extra CPU
  cycles

## `linger.ms` & `batch.size`

- By default, Kafka producers try to send records as soon as possible

  - It will have up to `max.in.flight.requests.per.connection=5`, meaning up to
    5 message batches being in flight (being sent between the producer & the
    broker) at most

  - After this, if more messages must be sent while others are in flight, Kafka
    is smart enough to start batching them before the next batch is sent

- This smart batching helps in improving throughput while maintaining very low
  latency

  - Added benefit: batches have higher compression ratio so better efficiency

- Two settings to influence the batching mechanism

  - `linger.ms`: (default 0) how long to wait until we send a batch. Adding a
    smaller number, for example, 5 ms, helps add more messages in the batch at
    the expense of latency

  - `batch.size`: if a batch is filled before `linger.ms`, increase the batch
    size

## `batch.size` (default 16KB)

- Maximum number of bytes that will be included in a batch

- Increasing a batch size to something like 32KB or 64KB can help increase the
  compression, throughput and efficiency of requests

- Any message that is bigger than the batch size will not be batched

- A batch is allocated per partition, so make sure that you don't set it to a
  number that's too high, otherwise you'll run waste memory.

- (Note: You can monitor the average batch size metric using Kafka Producer
  Metrics)

## High Throughput Producer

- Increase `linger.ms` and the producer will wait a few milliseconds for the
  batches to fill them up before sending them

- If you are sending full batches and have memory to spare, you can increase
  `batch.size` and send larger batches

- Introduce some producer-level compression for more efficiency in sends

```java {"id":"01HJFWE66K1PD3X47C40C4W6J1"}
// high throughput producer (at the expense of a bit of latency and CPU usage)
properties.setProperty(ProducerConfig.COMPRESSION_TYPE_CONFIG, "snappy");
properties.setProperty(ProducerConfig.LINGER_MS_CONFIG, "20");
properties.setProperty(ProducerConfig.BATCH_SIZE_CONFIG, Integer.toString(32*1024));
```

## Producer Default Partitioner when `key != null`

- **Key Hashing** is the process of determining the mapping of a key to a
  partition

- In the default Kafka partitioner, the keys are hashed using the **murmur2**
  **algorithm**
  `targetPartition = Math.abs(Utils.murmur2(keyBytes)) % (numPartitions - 1)`

- This means that same key will go to the same partition (we already know this),
  and adding partitions to a topic will completely alter the formula

- It is most likely preferred to not override the behaviour of the partitioner,
  but it is possible to do so using `partition.class`

## Producer Default Partitioner when `key == null`

- When `key=null`, the producer has a `default partitioner` that varies:
  - Round Robin: for Kafka 2.3 and below
  - Sticky Partitioner: for Kafka 2.4 and above

- Sticky Partitioner improves the performance of the producer especially when
  high throughput when the key is null

## Producer Default Paritioner Kafka <= 2.3 Round Robin Partitioner

- With Kafka <= 2.3, when there's no partition and no key specified, the default
  partitioner sends data in a round-robin fashion

- This results in more batches (one batch per partition) and smaller batches
  (imagine with 100 partitions)

- Smaller batches lead to more requests as well as high latency

![round_robin_partitioner](./pics/round_robin_partitioner.png)

## Producer Default Paritioner Kafka >= 2.4 Sticky Partitioner

- It would be better to have all the records sent to a single partition and not
  multiple partitions to improve batching

- The producer `sticky partitioner`:
  - We "stick" to a partition until the batch is full or `linger.ms` has elapsed
  - After sending the batch, the partition that is sticky changes

- Larger batches and reduced latency (because larger requests, and `batch.size`
  more likely to be reached)

- Over time, records are still spread evenly across partitions

![sticky_partitioner](./pics/sticky_partitioner.png)

## Sticky Partitioner - Performance Improvement

![sticky_partitioner_performance_improvement](./pics/sticky_partitioner_performance_improvement.png)

## `max.block.ms` & `buffer.memory`

- If the producer produces faster than the broker can take, the records will be
  buffered in memory

- `buffer.memory=33554432` **(32MB):** the size of the send buffer

- The buffer will fill up over time and empty back down when the throughput to
  the broker increases

- If that buffer is full (all 32MB), then the `.send()` method will start to
  block (won't right away)

- `max.block.ms=60000`: the time the `.send()` will block until throwing an
  exception.
  Exceptions are thrown when:
  - The producer has filled up its buffer
  - The broker is not accepting any new data
  - 60 seconds has elapsed

- If you hit an exception hit that usually means your brokers are down or
  overloaded as they can't respond to requests

## Free Cloud Stuff

- [opensearch_cluster](https://bonsai.io/)
- [kafka_cluster](https://upstash.com/)
- [connect_kafka_to_conduktor](https://www.conduktor.io/)

## Delivery Semantics for Consumers - Summary

- **At most once:** offsets are committed as soon as the message is received. If
  the processing goes wrong, the message will be lost (it won't be read again).

- **At least once (preferred):** offsets are committed after the message is
  processed. If the processing goes wrong, the message will be read again. This
  can result in duplicate processing of messages. Make sure processing is
  **idempotent** (i.e. processing again the messages won't impact your system)

- **Exactly once:** Can be achieved for Kafka => Kafka workflows using the
  Transactional API (easy with Kafka Stream API). For Kafka => Sink workflows,
  use an idempotent consumer.

**Bottom line:** for most applications you should use **at least once**
**processing** and ensure your transformations / processing are idempotent

## At least once Strategies

```java {"id":"01HJG69WFBTSNEE2NRRFGDRN00"}
// Strategy 1
// Define an ID using Kafka Record coordinates
String id = record.topic() + "_" + record.partition() + "_" + record.offset();

// Strategy 2
// Extract the ID from the content (if it provides one)
String id = extractId(record.value());

IndexRequest indexRequest = new IndexRequest("wikimedia")
  .source(record.value(), XContentType.JSON)
  .id(id);
```

## Consumer Offset Commit Strategies

- There are two most common patterns for committing offsets in a consumer
  application.

- **2 strategies:**
  - (easy) `enable.auto.commit=true` & synchronous processing of batches
  - (medium) `enable.auto.commit=false` & manual commit of offsets

## Kafka Consumer - Auto Offset Commit Behaviour

- In the Java Consumer API, offsets are regularly committed
- Enable at-least once reading scenario by default (under conditions)

- Offsets are committed when you call `.poll()` and `auto.commit.interval.ms`
  has elapsed

- Example: `auto.commit.interval.ms=5000` and `enable.auto.commit=true` will
  commit

- Make sure messages are all successfully processed before you can `poll()`
  again

  - If you don't, you will not be in an at-least-once reading scenario

  - In that (rare) case, you must disable `enable.auto.commit`, and most likely
    move processing to a separate thread, and then from time-to-time call
    `.commitSync()` or `.commitAsync()` with the correct offsets manually
    (advanced)

- Example for `enable.auto.commit=true` & synchronously process batches

  - Accumulating records into a buffer and then flushing the buffer to a
    database + committing offsets asynchronously then

- `enable.auto.commit=true` & storing offsets externally

  - **This is advanced:**

    - You need to assign partitions to your consumers at launch manually using
      `.seek()` API

    - You need to model and store your offsets in a database table for example
    - You need to handle cases where rebalances happen
      (`ConsumerRebalanceListener` interface)

  - *Example:* if you need exactly once processing and can't find any way to do
    idempotent processing, then you "process data" + "commit offsets" as part of
    a single transaction.

  - *Note:* I don't recommend using this strategy unless you exactly know what
    and why you're doing it

## Consumer Offset Reset Behaviour

- A consumer is expected to read from a log continuously
- But if your application has a bug, your consumer can be down

- If Kafka has a retention of 7 days, and your consumer is down for more than
  7 days, the offsets are "invalid"

- The behaviour of the consumer is to then use:
  - `auto.offset.reset=latest`: will read from the end of the log
  - `auto.offset.reset=earliest`: will read from the start of the log
  - `auto.offset.reset=none`: will throw exception if no offset is found

- Additionally, consumer offsets can be lost:
  - If a consumer hasn't read new data in 1 day (Kafka < 2.0)
  - If a consumer hasn't read new data in 7 days (Kafka >= 2.0)

- This can be controlled by the broker setting `offset.retention.minutes`

## Replaying data for Consumers

- To replay data for a Consumer Group:
  - Take all the Consumers from a specific Group down
  - Use `kafka-consumer-groups` command to set offset to what you want
  - Restart consumers

- **Bottom line:**
  - Set proper data retention period & offset retention period
  - Ensure the auto offset reset behaviour is the one you expect / want
  - Use replay capability in case of unexpected behaviour

## Controlling Consumer Liveliness

- Consumers in a Group talk to a Consumer Groups Coordinator

- To detect consumers that are "down", there is a "heartbeat" mechanism and a
  "poll" mechanism

- To avoid issues, consumers are encouraged to process data fast and poll often

![consumer_liveliness](./pics/consumer_liveliness.png)

## Consumer Heartbeat Thread

- `hearbeat.interval.ms` **(default 3 seconds):**
  - How often to send hearbeats
  - Usually set to 1/3rd of `session.timeout.ms`

- `session.timeout.ms` **(default 45 seconds Kafka 3.0+, before 10 seconds):**
  - Heartbeats are sent periodically to the broker
  - If no heartbeat is sent during that period, the consumer is considered dead
  - Set even lower to faster consumer rebalances

- Take-away: This mechanism is used to detect a consumer application being down

## Consumer Poll Thread

- `max.poll.interval.ms` **(default 5 minutes):**

  - Maximum amount of time between two `.poll()` calls before declaring the
    consumer dead

  - This is relevant for Big Data frameworks like Spark in case the processing
    takes time

- Take-away: This mechanism is used to detect a data processing issue with the
  consumer (consumer is "stuck")

- `max.poll.records` **(default 500):**
  - Controls how many records to retrieve per poll request
  - Increase if your messages are very small and have a lot of available RAM
  - Good to monitor how many records are polled per request
  - Lower if it takes you too much time to process records

## Consumer Poll Behaviour

- `fetch.min.bytes` **(defaults 1):**
  - Controls how much data you want to pull at least on each request
  - Helps improving throughput and decreasing request number
  - At the cost of latency

- `fetch.max.wait.ms` **(default 500):**

  - The maximum amount of time the Kafka broker will block before answering the
    fetch request if there isn't sufficient data to immediately satisfy the
    requirement given by fetch.min.bytes

  - This means that until the requirement of fetch.min.bytes to be satisfied,
    you will have up to 500 ms of latency before the fetch returns data to the
    consumer (e.g. introducing a potential delay to be more efficient in
    requests)

- `max.partition.fetch.bytes` **(default 1MB):**
  - The maximum amount of data per partition the server will return
  - If you read from 100 partitions, you'll need a lot of memory (RAM)

- `fetch.max.bytes` **(default 55MB):**
  - Maximum data returned for each fetch request

  - If you have available memory, try increasing fetch.max.bytes to allow the
    consumer to read more data in each request.

- Advanced: Change these settings only if your consumer maxes out on throughput
  already

## Default Consumer Behaviour with partition leaders

- Kafka Consumers by default will read from the leader broker for a partition
- Possibly higher latency (multiple data centre), + high network charges ($$$)

- Example: Data Centre === Availability Zone (AZ) in AWS, you pay Cross AZ
  network charges

## Kafka Consumers Replica Fetching (Kafka v2.4+)

- Since Kafka 2.4, it is possible to configure consumers to read from **the**
  **closest replica**

- This may help improve latency, and also decrease network costs if using the
  cloud (you pay for the replication though)

## Consumer Rack Awareness (v2.4+) - How to Setup

- *Broker setting:*
  - Must be version Kafka v2.4+
  - `rack.id` config must be set to the data centre ID (ex: AZ ID in AWS)
  - Example for AWS: AZ ID `rack.id=usw2-az1`

  - `replica.selector.class` must be set to
    `org.apache.kafka.common.replica.RackAwareReplicaSelector`

- *Consumer client setting:*
  - Set `client.rack` to the data centre ID the consumer is launched on

## Kafka Ecosystem (Higher Level APIs)

- **Kafka Connect** solves External Source => Kafka and Kafka => External Sink
- **Kafka Streams** solves transformations Kafka => Kafka
- **Schema Registry** helps using Schema in Kafka

![high_level_api_arch``](./pics/high_level_api_arch.png)

## Kafka Connect - High level

- **Source Connectors** to get data from Common Data Sources
- **Sink Connectors** to publish data in Common Data Stores

- Make it easy for non-experienced dev to quickly get their data reliably into
  Kafka

- Part of your ETL (Extract, Transform, Load) pipeline
- Scaling made easy from small pipelines to company-wide pipelines
- Other programmers may already have done a very good job: re-usable code!
- Connectors achieve fault tolerance, idempotence, distribution, ordering

## Kafka Streams Introduction

- You want to do the following from the *wikimedia.recentchange* topic:
  - Count the number of times a change was created by a bot versus a human
  - Analyze number of changes per website (ru.wikipedia.org vs en.wikipedia.org)
  - Number of edits per 10-seconds as a time series

- With the Kafka Producer and Consumer, you can achieve that but it's very low
  level and not developer friendly

![kafka_streams_intro](./pics/kafka_streams_intro.png)

## What is Kafka Streams ?

- Easy **data processing and transformation library** within Kafka
- Standard Java Application
- No need to create a separate cluster
- Highly elastic, scalable and fault tolerant
- Exactly-Once Capabilities
- One record at a time processing (no batching)
- Works for any application size

![kafka_streams](./pics/kafka_streams.png)

## Schema Registry - Purpose

- Store and retrieve schemas for Producers / Consumers
- Enforce Backward / Forward / Full compatibility on topics
- Decrease the size of the payload of data sent to Kafka

![schema_registry](./pics/schema_registry.png)

## Schema Registry - gotchas

- Utilizing a schema registry has a lot of benefits

- BUT it implies you need to
  - Set it up well
  - Make sure it's highly available
  - Partially change the producer and consumer code

- *Apache Avro* as a format is awesome but has a learning curve
- Other formats include *Protobuf* and *JSON Schema*
- The Confluent Schema Registry is free and source-available
- Other open-source alternatives may exist

## Which Kafka API to use ?

![pick_kafka_api](./pics/pick_kafka_api.png)

## Partition Count & Replication Factor

- The two most important parameters when creating a topic
- They may impact performance and durability of the system overall

- It is best to get the parameters right the first time!

  - If the partitions count increases during a topic lifecycle, you will break
    your keys ordering guarantees

  - If the replication factor increases during a topic lifecycle, you put more
    pressure on your cluster, which can lead to unexpected performance decrease

## Choosing the Partitions Count

- Each partitions can handle a throughput of a few MB/s (measure it in your
  setup!)

- More partitions implies:
  - Better parallelism, better throughput

  - Ability to run more consumers in a group to scale (max as many consumers
    per group as partitions)

  - Ability to leverage more brokers if you have a large cluster
  - BUT more elections to perform for Zookeeper (if using)
  - BUT more files opened on Kafka

- *Guidelines:*
  - **Partitions per topic = MILLION DOLLAR QUESTION**
    - (Intuition) Small cluster (<6 brokers): 3x # brokers
    - (Intuition) Big cluster (>12 brokers): 2x # brokers

    - Adjust for number of consumers you need to run in parallel at peak
      throughput

    - Adjust for producer throughput (increase if super-high throughput or
      projected increase in the next 2 years)

  - **TEST!** Every Kafka cluster will have different performance.
  - Don't systematically create topics with 1000 partitions!

## Choosing the Replication Factor

- Should be at least 2, usually 3, maximum 4

- The higher the replication factor (N):
  - Better durability of your system (N - 1 brokers can fail)

  - Better availability of your system (N - min.insync.replicas if producer
    acks=all)

  - BUT more replication (higher latency if acks=all)
  - BUT more disk space on your system (50% more RF is 3 instead of 2)

- *Guidelines:*
  - **Set it to 3 to get started** (you must have at least 3 brokers for that)

  - If replication performance is an issue, get a better broker instead of less
    RF

  - **Never set it to 1 in production**

## Cluster guidelines

- Total number of partitions in the cluster:

  - Kafka with Zookeeper: max 200,000 partitions (Nov 2018) - Zookeeper Scaling
    limit
    - Still recommends a maximum of 4,000 partitions per broker (soft limit)

  - Kafka with KRaft: potentially millions of partitions

- If you need more partitions in your cluster, add brokers instead

- If you need more than 200,000 partitions in your cluster (it will take time
  to get there!), follow the Netflix model and create more Kafka clusters

- Overall, you don't need a topic with 1000 partitions to achieve high
  throughput. *Start at a reasonable number* and test the performance

## Topic Naming Conventions

- [FROM](https://cnr.sh/essays/how-paint-bike-shed-kafka-topic-naming-conventions)
- Really helpful for Security as it needs some hierarchy & pattern recognition
- `<message type>.<dataset name>.<data name>.<data format>`

- *Message Type:*
  - **logging:** For logging data (slf4j, syslog, etc)
  - **queuing:** For classical queuing use cases

  - **tracking:** For tracking events such as user clicks, page views, ad views,
    etc

  - **etl/db:** For ETL and CDC use cases such as database feeds

  - **streaming:** For intermediate topics created by stream processing
    pipelines

  - **push:** For data that's being pushed from offline (batch computation)
    environments into online environments

  - **user:** For user-specific data such as scratch and test topics

- The *dataset name* is analogous to a database name in traditional RDBMS
  systems. It's used as a category to group topics together.

- The *data name* field is analogous to a table name in traditional RDBMS
  systems, though it's fine to include further dotted notation if developers
  wish to impose their own hierarchy within the dataset namespace

- The *data format* for example .avro, .json, .text, .protobuf, .csv, .log
- Use snake_case

## Case Study - MovieFlix

![movie_flix](./pics/movie_flix.png)

- show_position topic:
  - is a topic that can have multiple producers
  - Should be highly distributed if high volume > 30 partitions
  - If I were to choose a key, I would choose "user_id"

- recommendations topic:

  - The kafka streams recommendation engine may source data from the analytical
    store for historical training

  - May be a low volume topic
  - If I were to choose a key, I would choose "user_id"

## Case Study - GetTaxi

![get_taxi](./pics/get_taxi.png)

- taxi_position, user_position topics:
  - Are topics that can have multiple producers
  - Should be highly distributed if high volume > 30 partitions
  - If I were to choose a key, I would choose "user_id", "taxi_id"
  - Data is ephemeral and probably doesn't need to be kept for a long time

- surge_pricing topic:
  - The computation of Surge pricing comes from the Kafka Streams application
  - Surge pricing may be regional and therefore that topic may be high volume

  - Other topics such as "weather" or "events" etc can be included in the Kafka
    Streams application

## Case Study - MySocialMedia - CQRS

![my_social_media](./pics/my_social_media.png)

- Responsibilities are "segregated" hence we can call the model CQRS (Command
  Query Responsibility Segregation)

- Posts
  - Are topics that can have multiple producers
  - Should be highly distributed if high volume > 30 partitions
  - If I were to choose a key, I would choose "user_id"
  - We probably want a high retention period of data for this topic

- Likes, Comments
  - Are topics with multiple producers

  - Should be highly distributed as the volume of data is expected to be much
    greater

  - If I were to choose a key, I would choose "post_id"

- The data itself in Kafka should be formatted as "events":
  - User_123 created a post_id 456 at 2 pm
  - User_234 created a post_id 456 at 3 pm
  - User_123 deleted a post_id 456 at 6 pm

## Case Study - MyBank - Finance Application

![my_bank](./pics/my_bank.png)

- Bank Transaction topics:
  - Kafka Connect Source is a great way to expose data from existing databases!

  - There are tons of CDC (change data capture) connectors for technologies such
    as PostgreSQL, Oracle, MySQL, SQLServer, MongoDB etc...

- Kafka Streams application:
  - When a user changes their settings, alerts won't be triggered for past
    transactions

- User thresholds topics:
  - It is better to send *events* to the topic (User 123 enabled threshold at
    $1000 at 12pm on July 12th 2018) than sending the state of the user:
    (User 123: threshold $1000)

## Case Study - Big Data Ingestion

![big_data_ingestion](./pics/big_data_ingestion.png)

- It is common to have "generic" connector or solutions to offload data from
  Kafka to HDFS, Amazon S3, and Elastic Search for example

- It is also very common to have Kafka serve a "speed layer" for real time
  applications, while having a "slow layer" which helps with data ingestions
  into stores for later analytics

- Kafka as a front to Big Data Ingestion is a common pattern in Big Data to
  provide an "ingestion buffer" in front of some stores

## Case Study - Logging & Metrics Aggregation

![logging_and_metrics_aggregation](./pics/logging_and_metrics_aggregation.png)

- One of the first use case of Kafka was to ingest logs and metrics from various
  applications

- This kind of deployment usually wants high throughout, has less restriction
  regarding data loss, replication of data, etc.

- Applications logs can end up in your favourite logging solution such as Splunk
  , CloudWatch, ELK, etc...

## Kafka Cluster Setup - High Level Architecture

- You want multiple brokers in different data centers (rack) to distribute your
  load. You also want a cluster of at least 3 Zookeeper (if using)

- In AWS:
  - ![classic_kafka_setup_in_aws](./pics/classic_kafka_setup_in_aws.png)

## Kafka Cluster Setup Gotchas

- It's not easy to setup a cluster
- You want to isolate each Zookeeper & Broker on separate servers
- Monitoring needs to be implemented
- Operations must be mastered
- You need an excellent Kafka Admin

- *Alternative:* managed "Kafka as a Service" offerings from various companies
  - Amazon MSK, Confluent Cloud, Aiven, CloudKarafka, Instraclustr, Upstash,
    etc...
  - No operational burdens (updates, monitoring, setup, etc...)

- How many brokers ?
  - Compute your throughput, data retention, and replication factor
  - Then test for your use case

## Other components to properly setup Kafka Cluster

- Kafka Connect Clusters
- Kafka Schema Registry: make sure to run two for high availability
- UI tools for ease of administration
- Admin Tools for automated workflows

- Automate as much as you can your infrastructure when you've understood how
  processes work!

## Kafka Monitoring and Operations

- Kafka exposes metrics through JMX

- These metrics are highly important for monitoring Kafka, and ensuring the
  systems are behaving correctly under load

- Common places to host the Kafka metrics:
  - ELK (ElasticSearch + Kibana)
  - Datadog
  - NewRelic
  - Confluent Control Centre
  - Promotheus
  - Many others...!

- Some of the most important metrics are:

  - *Under Replicated Partitions:* Number of partitions have problems with ISR
    (in-sync replicas). May indicate a high load on the system

  - *Request Handlers:* utilization of threads for IO, network, etc... overall
    utilization of an Apache Kafka broker

  - *Request Timing:* how long it takes to reply to requests. Lower is better,
    as latency will be improved

- References
  - [apache](https://kafka.apache.org/documentation/#monitoring)
  - [confluent](https://docs.confluent.io/current/kafka/monitoring.html)
  - [datadoghq](https://www.datadoghq.com/blog/monitoring-kafka-performance-metrics/)

## Kafka Operations

- Kafka Operations team must be able to perform the following tasks:
  - Rolling Restart of Brokers
  - Updating Configurations
  - Rebalancing Partitions
  - Increasing replication factor
  - Adding a Broker
  - Replacing a Broker
  - Removing a Broker
  - Upgrading a Kafka Cluster with zero downtime

- It is important to remember that managing your own cluster comes will all
  these responsibilities and more

## Kafka Security

- Currently, any client can access your Kafka Cluster **(authentication)**
- The clients can publish / consume any topic data **(authorization)**
- All the data being sent is fully visible on the network **(encryption)**

- Someone could *intercept data being sent*
- Someone could *publish bad data / steal data*
- Someone could *delete topics*

- All these reasons push for more security and an authentication model

## In-flight encryption in Kafka

- Encryption in Kafka ensures that the data exchanged between clients and
  brokers is secret to routers on the way

- This is similar concept to an https website
- Performance impact is negligible in JDK 11

![in_flight_encryption](./pics/in_flight_encryption.png)

## Authentication (SSL & SASL) in Kafka

- Authentication in Kafka ensures that only *clients that can prove their*
  *identity* can connect to our Kafka Cluster

- This is similar concept to a login (username / password)

![authentication](./pics/authentication.png)

- **SSL Authentication:** clients authenticate to Kafka using SSL certificates

- **SASL/PLAINTEXT**
  - clients authenticate using username / password (weak - easy to setup)
  - Must enable SSL encryption broker-side as well
  - Changes in passwords require brokers reboot (good for dev only)

- **SASL/SCRAM**
  - Username/password with a challenge (salt), more secure
  - Must enable SSL encryption broker-side as well

  - Authentication data is in Zookeeper (until removed) - add without restarting
    brokers

- **SASL/GSSAPI (Kerberos)**
  - Kerberos: such as Microsoft Active Directory (strong - hard to setup)
  - Very secure and enterprise friendly

- **SASL/OAUTHBEARER**
  - Leverage OAUTH2 tokens for authentication

## Authorization in Kafka

- Once a client is authenticated, Kafka can verify its identity
- It still needs to be combined with authorization, so that Kafka knows that

- ACL (Access Control Lists) must be maintained by administrators to onboard
  new users

## Kafka Security - Putting it all together

- It's hard to setup security in Kafka and requires significant understanding
  of security

- Best support for Kafka Security is with the Java clients although other
  clients based on librdkafka have good support for security now

## Kafka Multi Cluster & Replication

- Kafka can only operate will in a single region

- Therefore, it is very common for enterprises to have Kafka clusters across
  the world, with some level of replication between them

- A replication application at its core is just a consumer + a producer

- There are different tools to perform it:
  - **Mirror Maker 2** - open-source Kafka Connector connector ships with Kafka
  - **Netflix uses Flink** - they wrote their own application

  - **Uber uses uReplicator** - addresses performance and operations issues with
    MM

  - Comcast has their own open-source Kafka Connect Source
  - Confluent has their own Kafka Connect Source (paid)

- Overall, try these and see if it works for your case before writing your own

- Replicating doesn't preserve offsets, just data! Data at an offset in one
  cluster is not the same as the data at same offset in another cluster.

## Kafka Multi Cluster & Replication - Active / Active

- **Advantages**

  - Ability to server users from a nearby data center, which typically has
    performance benefits

  - Redundancy and resilience. Since every data center has all the functionality
    , if one data center is unavailable you can direct users to a remaining
    data center

- **Disadvantages**

  - The main drawback of this architecture is the challenges in avoiding
    conflicts when data is read and updated asynchronously in mulitple locations

## Kafka Multi Cluster & Replication - Active / Passive

- **Advantages**

  - Simplicity in setup and the fact that it can be used in pretty much any use
    case

  - No need to worry about access to data, handling conflicts, and other
    architectural complexities.

  - Good for cloud migrations as well

- **Disadvantages**

  - Waste of a good cluster

  - The fact that it is currently not possible to perform cluster failover in
    Kafka without either losing data or having duplicate events

## Kafka Multi Cluster & Replication - Resources

- [Confluent Replicator](https://docs.confluent.io/platform/current/multi-dc-deployments/replicator/replicator-tuning.html#improving-network-utilization-of-a-connect-task)
- [Kafka Mirror Maker Best Practices](https://community.cloudera.com/t5/Community-Articles/Kafka-Mirror-Maker-Best-Practices/ta-p/249269)
- [Netflix](https://www.confluent.io/kafka-summit-sf17/multitenant-multicluster-and-hieracrchical-kafka-messaging-service/)
- [Blog on Multi DC](https://www.altoros.com/blog/multi-cluster-deployment-options-for-apache-kafka-pros-and-cons/)
- [Comcast](https://github.com/Comcast/MirrorTool-for-Kafka-Connect)
- [Mirror Maker 2](https://cwiki.apache.org/confluence/display/KAFKA/KIP-382%3A+MirrorMaker+2.0)

## Understanding communications between Client and with Kafka

Advertised listeners is *the most important* setting of Kafka

![client_kafka_communication](./pics/client_kafka_communication.png)

What if I put localhost ?

![client_kafka_communication_2](./pics/client_kafka_communication_2.png)

What if I use the public IP ?

![client_kafka_communication_3](./pics/client_kafka_communication_3.png)

But remember, Public IP changes on reboot.

So what do I set for `advertised.listeners` ?

- If your clients are on your private network, set either:
  - the internal private IP
  - the internal private DNS hostname

- Your clients should be able to resolve the internal IP or hostname

- If your clients are on a public network, set either:
  - The external public IP
  - The external public hostname pointing to the public IP

- Your clients must be able to resolve the public hostname

## Partitions and Segments

- Topics are made of partitions
- Paritions are made of ...segments (files)!
- Only one segment is ACTIVE (the one data is being written to)

- Two segment settings:

  - *log.segment.bytes:* the max size of a single segment in bytes (default 1
    GB)

  - *log.segment.ms:* the time Kafka will wait before committing the segment if
    not full (1 week)

## Segments and Indexes

- Segments come with two indexes (files):

  - *An offset to position index:* helps Kafka find where to read from to find
    a message

  - *A timestamp to offset index:* helps Kafka find messages with a specific
    timestamp

![segments_and_indexes](./pics/segments_and_indexes.png)

## Segments: Why should I care ?

- A smaller **log.segment.bytes** (size, default: 1GB) means:
  - More segments per partitions
  - Log Compaction happens more often
  - BUT Kafka must keep more files opened (Error: Too many open files)

- *Ask yourself:* how fast will I have segments based on throughput ?

- A smaller **log.segment.ms** (time, default 1 week) means:
  - You set a max frequency for log compaction (more frequent triggers)
  - Maybe you want daily compaction instead of weekly ?

- *Ask yourself:* how often do I need log compaction to happen ?

## Log Cleanup Policies

- Many Kafka clusters make data expire, according to a policy
- That concept is called log cleanup

**Policy1:** `log.cleanup.policy=delete` (Kafka default for all user topics)
  - Delete based on age of data (default is a week)
  - Delete based on max size of log (default -1 == infinite)

**Policy2:** `log.cleanup.policy=compact` (Kafka default for topic
__consumer_offsets)
  - Delete based on keys of your messages
  - Will delete old duplicate keys **after** the active segment is committed
  - Infinite time and space retention

## How often does log cleanup happen ?

- Log cleanup happens on your partition segments!
- Smaller / More segments means that log cleanup will happen more often!
- Log cleanup shouldn't happen too often => takes CPU and RAM resources
- The cleaner checks for work every 15 seconds (`log.cleaner.backoff.ms`)

## Log Cleanup Policy: Delete

- `log.retention.hours`:
  - number of hours to keep data for (default is 168 - one week)
  - Higher number means more disk space

  - Lower number means that less data is retained (if your consumers are down
    for too long, they can miss data)

  - Other parameters allowed: `log.retention.ms`, `log.retention.minutes`
    (smaller unit has precedence)

- `log.retention.bytes`:
  - Max size in Bytes for each partition (default is -1 - infinite)
  - Useful to keep the size of a log under a threshold

Use cases - two common pair of options:
- *One week of retention:*
  - `log.retention.hours=168` and `log.retention.bytes=-1`
- *Infinite retention bounded by 500MB:*
  - `log.retention.ms=-1` and `log.retention.bytes=524288000`

## Log Cleanup Policy: Compact

- Log compaction ensures that your log contains at least the last known value
  for a specific key within a partition

- Very useful if we just require a SNAPSHOT instead of full history (such as
  for a data table in a database)

- The idea is that we only keep the latest "update" for a key in our log

![log_compaction](./pics/log_compaction.png)

## Log Compaction Guarantees

- Any consumer that is reading from the tail of a log (most current data) will
  still see all the messages sent to the topic

- Ordering of messages is kept, log compaction only removes some messages, but
  does not re-order them

- The offset of a message is immutable (it never changes). Offsets are just
  skipped if a message is missing

- Deleted records can still be seen by consumers for a period of
  `delete.retention.ms` (default is 24 hours).

## Log Compaction Myth Busting

- It doesn't prevent you from pushing duplicate data to Kafka
  - De-duplication is done after a segment is committed
  - Your consumers will still read from tail as soon as the data arrives

- It doesn't prevent you from reading duplicate data from Kafka
  - Same points as above

- Log Compaction can fail from time to time
  - It is an optimization and it the compaction thread might crash
  - Make sure you assign enough memory to it and that it gets triggered
  - Restart Kafka if log compaction is broken

- You can't trigger Log Compaction using an API call (for now...)

## Log Compaction - How it works

![log_compaction_2](./pics/log_compaction_2.png)

Log compaction `log.cleanup.policy=compact` is impacted by:

- `segment.ms` (default 7 days): Max amount of time to wait to close active
  segment

- `segment.bytes` (default 1G): Max size of a segment

- `min.compaction.lag.ms` (default 0): how long to wait before a message can be
  compacted

- `delete.retention.ms` (default 24 hours): wait before deleting data marked
  for compaction

- `min.cleanable.dirty.ratio` (default 0.5): higher => less, more efficient
  cleaning. Lower => opposite

## `unclean.leader.election.enable`

- If all your In Sync Replicas go offline (but you still have out of sync
  replicas up), you have the following option:

  - Wait for an ISR to come back online (default)

  - Enable `unclean.leader.election.enable=true` and start producing to non-ISR
    partitions

- If you enable `unclean.leader.election.enable=true`, you improve availability,
  but you will lose data because other messages on ISR will be discarded when
  they come back online and replicate data from the new leader.

- Overall, this is very dangerous setting, and its implications must be
  understood fully before enabling it.

- Use cases include metrics collection, log collection, and other cases where
  data loss is somewhat acceptable, at the trade-off of availability.

## Large Messages In Apache Kafka

- Kafka has a default of 1 MB per message in topics, as large messages are
  considered inefficient and an anti-pattern.

- Two approaches for sending large messages:

  - Use an external store: store messages in HDFS, Amazon S3, Google Cloud
    Storage, etc... and send a reference of that message to Apache Kafka

  - Modifying Kafka parameters: must change broker, producer and consumer
    settings

**Option 1:**
![large_messages_in_kafka](./pics/large_messages_in_kafka.png)

**Option 2: Sending large messages in Kafka (ex: 10MB)**
- **Topic-wise, Kafka-side**, set max message size to 10MB:
  - Broker side: modify `message.max.bytes`
  - Topic side: modify `max.message.bytes`
  - Warning: the settings have similar but different name; this is not a typo!

- **Broker-wise**, set max replication fetch size to 10MB
  - `replica.fetch.max.bytes=10485880` (in server.properties)

- **Consumer-side**, must increase fetch size or the consumer will crash:
  - `max.partition.fetch.bytes=10485880`

- **Producer-side**, must increase the max request size
  - `max.request.size=10485880`
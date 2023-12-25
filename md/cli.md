---
runme:
  id: 01HJBKVBWDWR6TG36TQR5RXTH4
  version: v2.0
---

# CLI

## Kafka Topics

```sh {"id":"01HJBMTBFBMPSJD37WKM2RWXWJ"}
# Requires playground.config file
# with content such as
security.protocol=SASL_SSL
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="<your username>" password="<your password>";
sasl.mechanism=PLAIN

# Localhost is less secure
# To run commands in localhost, replace the following:
--command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092
# with the following:
--bootstrap-server localhost:9092

# Create Topic
## This will create Topic with 1 Partition & a Replication Factor of 1
kafka-topics.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --create \
  --topic first_topic

## Create Topic with 5 Partitions
kafka-topics.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --create \
  --topic second_topic \
  --partitions 5

## Create 1 Partition with a Replication Factor of 2
## (Conduktor forces it up to 3)
kafka-topics.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --create \
  --topic third_topic \
  --replication-factor 2

## List all Topics
kafka-topics \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --list

## Describe Topics
kafka-topics.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic first_topic \
  --describe

## Delete Topics
## (only works if delete.topic.enable=true)
kafka-topics.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic second_topic \
  --delete
```

## Kafka Producer

Ways:

- Produce without keys
- Produce with keys

```sh {"id":"01HJBRFSWRREQVDJT4P7EEE6CJ"}
# Produce
## If you push message to a new topic, it will be auto-created
## This is disabled on Conduktor
## On localhost, by default, only 1 partition will be created with RF of 1
## You can edit config/server.properties or config/kraft/server.properties
## num.partitions=3
kafka-console-producer.sh \
  --producer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic first_topic \
  --producer-property acks=all
>Hello World
>My name is Conduktor
>I love Kafka
>^C  (<- Ctrl + C is used to exit the producer)

## Produce with keys
kafka-console-producer.sh \
  --producer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic first_topic \
  --property parse.key=true \
  --property key.separator=:
>example key:example value
>name:Stephane

## Set partitioner algorithm
## Do not use round-robin producer in production
## In production, Kafka switches partitions when 16kb of data has been sent
kafka-console-producer.sh \
  --producer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --producer-property partitioner.class=org.apache.kafka.clients.producer.RoundRobinPartitioner \
  --topic second_topic
```

## Kafka Consumers

Ways:

- Consume from tail of the topic
- Consume from the beginning of the topic
- Show both keys and values in the output

```sh {"id":"01HJBT8TCKXN7G6CSXX2JR0F3B"}
# Consuming
kafka-console-consumer.sh \
  --consumer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic second_topic

## Consume from beginning
## All messages in a partition will be consumed together
## But partitions may be selected in any order
kafka-console-consumer.sh \
  --consumer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic second_topic \
  --from-beginning

## Format settings
kafka-console-consumer.sh \
  --consumer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic second_topic \
  --formatter kafka.tools.DefaultMessageFormatter \
  --property print.timestamp=true \
  --property print.key=true \
  --property print.value=true \
  --property print.partition=true \
  --from-beginning
```

## Kafka Group Consumer

```sh {"id":"01HJBZ0ZXX0B8KWWV126D4SWA3"}
# Start 1 Consumer Group
kafka-console-consumer.sh \
  --consumer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic third_topic \
  --group my-first-application

## Note that (Consumers - Partitions) will never consume

## Read from beginning
## If you run this command a second time, you'll see nothing
## from-beginning only works with consumer groups if there is no consumer offset
kafka-console-consumer.sh \
  --consumer.config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --topic third_topic \
  --group my-second-application \
  --from-beginning
```

## Consumer Group Management

```sh {"id":"01HJBZTGV2H5WA0Y89P81MH59P"}
# List Consumer Groups
kafka-consumer-groups.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --list

# Describe a Group
kafka-consumer-groups.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --describe \
  --group my-second-application
```

## Reset Consumer Group Offset

```sh {"id":"01HJC0EZ0322JBSEXBKB2CMZ5F"}
# Reset Offset for each partition
# Consumer Group must be stopped before reset

## Dry Run
kafka-consumer-groups.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --group my-first-application \
  --reset-offsets \
  --to-earliest \
  --topic third_topic \
  --dry-run

## Execute
kafka-consumer-groups.sh \
  --command-config playground.config \
  --bootstrap-server cluster.playground.cdkt.io:9092 \
  --group my-first-application \
  --reset-offsets \
  --to-earliest \
  --topic third_topic \
  --execute
```

## Playing on Windows 10 on Localhost Inside Docker

```sh {"id":"01HJDXAYB1BG07BT8RKWMMY59R"}
# Create topic aquarium
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --topic aquarium

# List topics
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --list

# List Consumer Groups
kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --list

# Create a Producer
kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic aquarium \
  --producer-property acks=all

# Start a Consumer
kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic aquarium \
  --group group1
```

## Kafka Config

```sh {"id":"01HJGVQQ5TP0PGY6BD2BG7RMX7"}
# Show existing Configurations
kafka-configs.sh \
  --bootstrap-server localhost:9092 \
  --entity-type topics \
  --entity-name aquarium \
  --describe

# Add a Topic Configuration
kafka-configs.sh \
  --bootstrap-server localhost:9092 \
  --entity-type topics \
  --entity-name aquarium \
  --alter \
  --add-config min.insync.replicas=2

# Describe Topics to view Configurations
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --topic aquarium \
  --describe

# Delete Configuration
kafka-configs.sh \
  --bootstrap-server localhost:9092 \
  --entity-type topics \
  --entity-name aquarium \
  --alter \
  --delete-config min.insync.replicas

# View Configurations
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --topic aquarium \
  --describe
```

## Log Compaction

```sh {"id":"01HJH0K2V2C3B21WS1SPXW3ED5"}
# Link (https://www.conduktor.io/kafka/kafka-topic-configuration-log-compaction/)
# Create Topic with Configs
kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --topic employee-salary \
  --partitions 1 \
  --replication-factor 1 \
  --config cleanup.policy=compact \
  --config min.cleanable.dirty.ratio=0.001 \
  --config segment.ms=5000
```
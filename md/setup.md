---
runme:
  id: 01HJARKG0JR5849TXR6X8HBYHT
  version: v2.0
---

## Setup

## Setup on Ubuntu Using Conduktor

```sh {"id":"01HJARMDGY4MX7WW7JYREABCF4"}
# Option 1
# Preconfigured with an embedded Kafka (Redpanda)
# Linux
curl -L https://releases.conduktor.io/quick-start \
  -o docker-compose.yml \
  && docker compose up -d --wait \
  && echo "Conduktor started on http://localhost:8080"
# Windows
curl -L https://releases.conduktor.io/quick-start ^
  -o docker-compose.yml ^
  && docker compose up -d --wait ^
  && echo "Conduktor started on http://localhost:8080"

# Option 2
# Connect Conduktor to your own Kafka
curl -L https://releases.conduktor.io/console \
  -o docker-compose.yml \
  && docker compose up -d --wait \
  && echo "Conduktor started on http://localhost:8080"
# Windows
curl -L https://releases.conduktor.io/console ^
  -o docker-compose.yml ^
  && docker compose up -d --wait ^
  && echo "Conduktor started on http://localhost:8080"
```

[Connect to Free Upstash Cluster](https://www.conduktor.io/alternatives-for-conduktor-playground/)

1. [Install Conduktor with Docker](https://www.conduktor.io/get-started/)
2. [Create your account on Upstash](https://console.upstash.com/kafka)
3. Create your free Kafka cluster on Upstash
4. Update playground.config

   - On Upstash, go to the Details of your fresh new Kafka cluster, and copy
      the content of the Properties tab. It should be a URL like:
      https://console.upstash.com/kafka/XXX
   - Paste them using your favorite text editor into a file called:
      playground.config.

5. Update your Kafka bootstrap server

- You must **not** use `cluster.playground.cdkt.io:9092` as Kafka bootstrap
   server anymore as it will be removed and inaccessible soon.
- Use the one provided by Upstash: `bootstrap.servers=xxx.upstash.io:9092`.
- Here is an example of how your commands will look like:

```sh {"id":"01HJBKDQCJ8RKEZ5Y83HP4KR6J"}
kafka-topics.sh \
  --command-config playground.config \
  --bootstrap-server xxx.upstash.io:9092 \
  --list

```

6. Connect Conduktor to Upstash

- Open localhost setting > cluster > add new Cluster
- Copy/paste these values into the appropriate fields as shown below:

```plaintext {"id":"01HJBKDQCJ8RKEZ5Y83NM1PCX8"}
Bootstrap Server: xxx-kafka.upstash.io:9092
Security Protocol: SASL with SCRAM-SHA-256
Username and Password

```

- Test connection and click create configuration

[Install Kafka Cli](https://www.conduktor.io/kafka/how-to-install-apache-kafka-on-linux/)

It needs JDK 11+

Steps:

1. Navigate to [Amazon Corretto 11 Linux install page](https://docs.aws.amazon.com/corretto/latest/corretto-11-ug/linux-info.html)
   and follow the steps, which work for Debian, RPM, Alpine and Amazon Linux.
   Alternatively, you can download from the [Amazon Corretto 11 download page](https://docs.aws.amazon.com/corretto/latest/corretto-11-ug/downloads-list.html)
   and install the correct package for your Linux distribution (x64, aarch64, x86,
   arch32, etc...).
2. For example on Ubuntu (Debian-based systems)

```shell {"id":"01HJBKDQCJ8RKEZ5Y83S9VVEV5"}
wget -O- https://apt.corretto.aws/corretto.key | sudo apt-key add -
sudo add-apt-repository 'deb https://apt.corretto.aws stable main'
sudo apt-get update; sudo apt-get install -y java-11-amazon-corretto-jdk

```

Please follow the instructions [here](https://docs.aws.amazon.com/corretto/latest/corretto-11-ug/generic-linux-install.html)
to verify your installation of Amazon Corretto 11 and set the JDK as your
default Java in your Linux system.

Upon completion, you should get a similar output when doing `java -version`:

```shell {"id":"01HJBKDQCJ8RKEZ5Y83VV0H2FQ"}
openjdk version "11.0.10" 2021-01-19 LTS
OpenJDK Runtime Environment Corretto-11.0.10.9.1 (build 11.0.10+9-LTS)
OpenJDK 64-Bit Server VM Corretto-11.0.10.9.1 (build 11.0.10+9-LTS, mixed mode)shell
```

```sh {"id":"01HJB4S6MXQDGSVEF6V2A5J4QY"}
# Install Apache Kafka
# Visit https://kafka.apache.org/downloads
wget https://archive.apache.org/dist/kafka/3.0.0/kafka_2.13-3.0.0.tgz
tar -xvzf kafka_2.13-3.0.0.tgz
mv kafka_2.13-3.0.0.tgz ~
# Add ~/kafka_2.13-3.0.0/bin to PATH
```

```sh {"id":"01HJB57WTM2P4FTPN2J0ENA10C"}
# You can test with this command
kafka-topics.sh \
  --command-config playground.config \
  --bootstrap-server xxx.upstash.io:9092 \
  --list
```

## Setup on Windows 10

[baeldung](https://www.baeldung.com/ops/kafka-docker-setup)

```sh {"id":"01HJDEAHKJ2C1DKGFNSPQNSE93"}
# Single Node
# docker-compose.yml
version: '2'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 22181:2181

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - 29092:29092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

Install [Kafka Tool](https://kafkatool.com/download.html) for lightweight GUI

```sh {"id":"01HJEDPT4Y7Y116KCJVFEPY8RX"}
# Local Cluster
# docker-compose.yml
version: '2'
services:
  zookeeper-1:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 22181:2181

  zookeeper-2:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 32181:2181

  kafka-1:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper-1
      - zookeeper-2

    ports:
      - 29092:29092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper-1:2181,zookeeper-2:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-1:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
  kafka-2:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper-1
      - zookeeper-2
    ports:
      - 39092:39092
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper-1:2181,zookeeper-2:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-2:9092,PLAINTEXT_HOST://localhost:39092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```
# PIKUMIVERSE MQTT

## Setup

### Build

```
docker build -t pikmiverse-mqtt .
```

### Run

```
docker network create pikmiverse-network
docker run --name pikmiverse-mqtt -itd --privileged=true -p 1883:1883 -p 8883:8883 --network pikmiverse-network --tty pikmiverse-mqtt
```

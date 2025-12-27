# PIKUMIVERSE MQTT

## Setup

### Build

```
docker build -t pikumiverse-mqtt .
```

### Run

```
docker network create pikumiverse-network
docker run --name pikumiverse-mqtt -itd --privileged=true -p 1883:1883 -p 8883:8883 --network pikumiverse-network --tty pikumiverse-mqtt
```

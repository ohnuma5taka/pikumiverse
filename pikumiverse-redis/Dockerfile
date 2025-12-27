FROM redis:latest

RUN apt update &&  \
    apt install -y build-essential vim redis-server sudo

COPY redis.conf /usr/local/etc/redis/redis.conf
RUN mkdir -p /usr/local/etc/redis/logs

EXPOSE 6379

RUN service redis-server start
CMD ["redis-server", "--appendonly", "yes"]

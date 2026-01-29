# PIKUMIVERSE 結婚式アプリ

## Setup

1. Clone repository

   ```bash
   git clone git@github.ibm.com:healthcare-team/pikumiverse-api.git
   ```

2. Place .env.local and .env.prod files in root folder

## Serving

### Local

1. Setup modules

   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -U pip && pip install -r requirements.txt
   ```

2. Start Redis

```bash
redis-server redis.conf
```

3. Serve

   ```bash
   python main.py
   ```

### Docker

1. Create Network

   ```bash
   # ネットワークが既にある場合はエラーになる
   docker network create pikumiverse-network
   ```

2. Run DB

   ```bash
   docker compose --env-file .env.db up -d pikumiverse-db
   ```

3. Build API

   ```bash
   docker build --build-arg APP_MODE=prod --build-arg APP_VERSION=1.0.0 -t pikumiverse-api .
   ```

4. Run API

   ```bash
   docker run --name pikumiverse-api -itd -p 8000:8000 --network pikumiverse-network -v "$(pwd)/app":/app/app  -v "$(pwd)/main.py":/app/main.py --tty pikumiverse-api
   ```

## Seed

db スキーマ作成

```bash
# For docker
docker exec -it pikumiverse-api python -m app.db.db
```

データの初期化

```bash
# For local
python -m test.seeds.seed

# For docker
docker exec -it pikumiverse-api python -m test.seeds.seed
```

# CIS SAGE 退院サマリー生成アプリ

## Setup

1. Clone repository

   ```bash
   git clone git@github.ibm.com:healthcare-team/pikumiverse-api.git
   ```

2. Place `.env` file in root folder

   https://ibm.box.com/s/em2m7dzgli7sk9mje45qg85c8jvl82fl

## Serving

### Local

1. Setup modules

   ```bash
   yarn
   ```

2. Serve

   Mode:

   - `dev`: serve on local with remote-serving API (according to proxy/proxy.dev.conf.json)
   - `local`: serve on local with local-serving API (according to proxy/proxy.local.conf.json)
   - `test`: serve on local without API

   Before serving as `dev` mode, place [proxy.dev.conf.json](https://ibm.box.com/s/quj3pkbendro0m2hat9woz498gn7lzld) to proxy folder.

   ```bash
   yarn start:local
   ```

### Docker

```bash
# ネットワークが既にある場合はエラーになる
docker network create pikumiverse-network
docker build -t pikumiverse-web $(bash parse_env.sh) .
docker run --name pikumiverse-web -itd --env-file .env -p 80:80 --tty pikumiverse-web
```

## Access

**NOTE**: Remember seeding data before access

| Serving with | Page           | sample URL                                                                                   |
| :----------- | :------------- | :------------------------------------------------------------------------------------------- |
| Local        | Summary editor | http://localhost:4200/summary?patientId=10001000&departmentCode=030&admissionDate=2016-10-01 |
| Local        | Prompt manager | http://localhost:4200/prompt                                                                 |
| Docker       | Summary editor | http://localhost/summary?patientId=10001000&departmentCode=030&admissionDate=2016-10-01      |
| Docker       | Prompt manager | http://localhost/prompt                                                                      |

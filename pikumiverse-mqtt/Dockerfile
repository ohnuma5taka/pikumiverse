FROM eclipse-mosquitto:2.0

WORKDIR /mosquitto
COPY certs certs

# グループとユーザを作成
RUN addgroup --system wscommon && \
    adduser --system --ingroup wscommon wsuser

# 権限を調整（必要であれば /mosquitto 配下全体）
COPY mosquitto.conf /mosquitto/config/mosquitto.conf
RUN chown -R wsuser:wscommon /mosquitto

# ユーザを切り替え
USER wsuser

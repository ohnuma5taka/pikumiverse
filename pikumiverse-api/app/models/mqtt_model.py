from pydantic import BaseModel


class MqttData(BaseModel):
    message: str | None = None

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlmodel import Session

from app.core.websocket_manager import websocket_manager
from app.db.db import engine
from app.models.mqtt_model import MqttData
from app.models.team_model import TeamModel
from app.services.mqtt_service import mqtt_service
from app.services.team_service import TeamServiceDependency, get_team_service
from app.utils import json_util

router = APIRouter(prefix="/teams", tags=["チーム"])


@router.get("", response_model=list[TeamModel])
def get_items(service: TeamServiceDependency) -> list[TeamModel]:
    return service.get_items()


@router.get("/{name:str}", response_model=TeamModel)
def get_item(name: str, service: TeamServiceDependency) -> TeamModel:
    return service.get_one(id=name)


@router.websocket("/{name:str}")
async def ws_item(name: str, websocket: WebSocket):
    try:
        await websocket_manager.connect(f"/{name}", websocket)
        while True:
            try:
                req_str = await websocket.receive_text()
                req_data = json_util.loads(req_str)["data"]
                score = int(req_data["score"])
                with Session(engine) as session:
                    team_service = get_team_service(session)
                    team = team_service.update_score(id=name, score=score)
                    req_data["score"] = team.score
                await websocket_manager.broadcast(f"/{name}", data=req_data)
                data = MqttData(message=f"score: {team.score}")
                mqtt_service.publish(data)
            except WebSocketDisconnect:
                break
    finally:
        await websocket_manager.disconnect(websocket)

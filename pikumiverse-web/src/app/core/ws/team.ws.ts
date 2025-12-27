import { TeamScore } from '@/app/core/models/team.model';
import { WebsocketService } from '@/app/core/services/ws.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TeamWebsocket extends WebsocketService<TeamScore, TeamScore> {
  connect(name: string) {
    super.connectWebsocket(`/teams/${name}`);
  }

  send(data: TeamScore) {
    this.submitWebsocket(data);
  }

  disconnect() {
    super.disconnectWebsocket();
  }
}

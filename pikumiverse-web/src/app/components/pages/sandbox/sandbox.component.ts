import { Component } from '@angular/core';
import { pageModules } from '@/app/app.config';
import { TeamWebsocket } from '@/app/core/ws/team.ws';
import { Team, TeamScore } from '@/app/core/models/team.model';
import { locationUtil } from '@/app/core/utils/location.util';
import { TeamApi } from '@/app/core/api/team.api';

export type SandboxQueryParam = {
  team_name: string;
};

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
  standalone: true,
  imports: pageModules,
})
export class SandboxComponent {
  team = new Team();
  constructor(private teamApi: TeamApi, private teamWebsocket: TeamWebsocket) {}

  async ngOnInit() {
    const urlQuery = locationUtil.queryParam() as SandboxQueryParam;
    this.team = await this.teamApi.getOne(urlQuery.team_name);
    await this.connectWebsocket();
  }

  connectWebsocket() {
    this.teamWebsocket.callback = this.teamWebsocketCallback.bind(this);
    this.teamWebsocket.connect(this.team.name);
  }

  teamWebsocketCallback(res: TeamScore) {
    this.team.score = res.score;
  }

  countup() {
    this.teamWebsocket.send({ score: this.team.score + 1 });
  }
}

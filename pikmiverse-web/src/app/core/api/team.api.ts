import { getMockTeam, getMockTeams } from '@/app/core/mocks/team.mock';
import { Team } from '@/app/core/models/team.model';
import { ApiService } from '@/app/core/services/api.service';
import { env } from '@/environments/env';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TeamApi {
  constructor(private apiService: ApiService) {}

  pathPrefix = '/teams';

  async getItems() {
    if (env.mode === 'test') return await getMockTeams();
    return await this.apiService.get<Team[]>(this.pathPrefix);
  }

  async getOne(name: string) {
    if (env.mode === 'test') return await getMockTeam(name);
    return await this.apiService.get<Team>(`${this.pathPrefix}/${name}`);
  }
}

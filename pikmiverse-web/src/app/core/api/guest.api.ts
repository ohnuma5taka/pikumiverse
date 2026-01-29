import { getMockGuest, getMockGuests } from '@/app/core/mocks/guest.mock';
import { Guest } from '@/app/core/models/guest.model';
import { ApiService } from '@/app/core/services/api.service';
import { env } from '@/environments/env';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GuestApi {
  constructor(private apiService: ApiService) {}

  pathPrefix = '/guests';

  async getItems() {
    if (env.mode === 'test') return await getMockGuests();
    return await this.apiService.get<Guest[]>(this.pathPrefix);
  }

  async getOne(code: string) {
    if (env.mode === 'test') return await getMockGuest(code);
    return await this.apiService.get<Guest>(`${this.pathPrefix}/${code}`);
  }
}

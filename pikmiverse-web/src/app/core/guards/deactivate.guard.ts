import { StoreService } from '@/app/core/services/store.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DeactivateGuard {
  constructor(private router: Router, private store: StoreService) {}
  async canDeactivate(
    _: any,
    route: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Promise<boolean> {
    return true;
  }
}

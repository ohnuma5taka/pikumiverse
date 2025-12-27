import { StoreService } from '@/app/core/services/store.service';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ActivateGuard {
  constructor(
    private router: Router,
    private store: StoreService,
    private snackbar: SnackbarService
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return true;
  }
}

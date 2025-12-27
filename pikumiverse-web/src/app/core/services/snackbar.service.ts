import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  default(message: string) {
    const data = { type: 'default', message };
    this.snackbar.open(message, '×', { data, panelClass: 'default' });
  }
  success(message: string) {
    const data = { type: 'success', message };
    this.snackbar.open(message, '×', { data, panelClass: 'success' });
  }
  info(message: string) {
    const data = { type: 'info', message };
    this.snackbar.open(message, '×', { data, panelClass: 'info' });
  }
  error(message: string) {
    const data = { type: 'error', message };
    this.snackbar.open(message, '×', { data, panelClass: 'error' });
  }
  warn(message: string) {
    const data = { type: 'warn', message };
    this.snackbar.open(message, '×', { data, panelClass: 'warn' });
  }

  admin(message: string) {
    const data = { type: 'admin', message };
    this.snackbar.open(message, '×', { data, panelClass: 'admin' });
  }
}

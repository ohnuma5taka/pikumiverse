import { moduleModules } from '@/app/app.config';
import { ConfirmDialogData } from '@/app/core/models/dialog.model';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: true,
  imports: moduleModules,
})
export class ConfirmDialogComponent {
  @Input() dialogData: ConfirmDialogData;
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() loading: boolean;
  @Output() emitConfirm = new EventEmitter();

  constructor(
    private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private matDialogData: ConfirmDialogData
  ) {}

  get data() {
    return this.dialogData || this.matDialogData;
  }

  get colorMode() {
    return this.data.action.confirm
      ? this.data.action.confirm.colorMode
      : 'default';
  }

  get iconClass() {
    const icon =
      this.data.icon ||
      (this.colorMode === 'alert'
        ? 'mdi-close-circle-outline'
        : 'mdi-check-circle-outline');
    const color =
      this.colorMode === 'alert' ? 'alert-color' : `${this.colorMode}-color`;
    return `${icon} ${color}`;
  }

  ngOnInit() {}

  cancel() {
    this.dialogRef.close({ action: 'cancel' });
  }

  confirm() {
    if (this.formGroup.invalid) {
      Object.keys(this.formGroup.controls).forEach((key) =>
        this.formGroup.controls[key].markAllAsTouched()
      );
      const message = '入力情報に誤りがあります。';
      this.snackbar.error(message);
      return;
    }
    if (this.dialogData) {
      this.emitConfirm.emit();
    } else {
      const action = { action: 'confirm' };
      this.dialogRef.close(action);
    }
  }
}

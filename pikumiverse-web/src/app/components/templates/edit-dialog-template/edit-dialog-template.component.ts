import { templateModules } from '@/app/app.config';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'edit-dialog-template',
  templateUrl: './edit-dialog-template.component.html',
  styleUrls: ['./edit-dialog-template.component.scss'],
  standalone: true,
  imports: templateModules,
})
export class EditDialogTemplateComponent {
  @Input() _id: string = '';
  @Input() title: string;
  @Input() formGroup: FormGroup;
  @Input() loading: boolean;
  @Output() emitRegister = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<EditDialogTemplateComponent>,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {}

  cancel() {
    this.dialogRef.close({ action: 'cancel' });
  }

  register() {
    if (this.formGroup.invalid) {
      Object.keys(this.formGroup.controls).forEach((key) =>
        this.formGroup.controls[key].markAllAsTouched()
      );
      this.snackbar.error('入力情報に誤りがあります。');
      return;
    }
    this.emitRegister.emit();
  }
}

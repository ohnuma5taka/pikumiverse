import { baseModules } from '@/app/app.config';
import { FormValidation } from '@/app/core/services/form.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppInputComponent<T extends string> {
  @Input() _id: string;
  @Input() label = '';
  @Input() value = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() prefixIcon = '';
  @Input() prefixText = '';
  @Input() suffixIcon = '';
  @Input() suffixText = '';
  @Input() tooltip = '';
  @Input() clearable = false;
  @Input() submitOnClear = false;
  @Input() disabled = false;
  @Input() autocomplete = '';
  @Input() formName = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() formValidation?: FormValidation<T>;
  @Output() emitInput = new EventEmitter<string>();
  @Output() submit = new EventEmitter<string>();
  @ViewChild('input') inputRef: ElementRef;
  constructor(private changeDetector: ChangeDetectorRef) {}

  passwordShowing = false;
  imeComposing = false;

  get formControl() {
    const name = this.formName as keyof typeof this.formGroup.controls;
    return name ? this.formGroup.controls[name] : undefined;
  }

  get errorMessage() {
    const name = this.formName as keyof typeof this.formValidation;
    return this.formValidation && this.formValidation[name];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.inputRef.nativeElement.addEventListener('input', (e: InputEvent) => {
      const imeTypes = [
        'insertCompositionText',
        'deleteCompositionText',
        'insertFromComposition',
        'deleteByComposition',
      ];
      this.imeComposing = imeTypes.includes(e.inputType);
    });
    this.inputRef.nativeElement.value = this.value;
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled'] && this.formControl) {
      this.disabled ? this.formControl.disable() : this.formControl.enable();
    }
  }

  checkMdiIcon(icon: string) {
    return icon.startsWith('mdi');
  }

  _input(v: string) {
    this.emitInput.emit(v);
  }

  _submit(v: string) {
    if (this.imeComposing) {
      this.imeComposing = false;
      return;
    }
    this.submit.emit(v);
  }

  clear(e: Event) {
    e.stopPropagation();
    this._input('');
    if (this.submitOnClear) {
      this.submit.emit('');
    }
  }
}

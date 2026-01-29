import { baseModules } from '@/app/app.config';
import {
  SelectOption,
  SelectOptionGroup,
} from '@/app/core/models/select.model';
import { FormValidation } from '@/app/core/services/form.service';
import { jsonUtil } from '@/app/core/utils/json.util';
import { sleep } from '@/app/core/utils/time.util';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppSelectComponent<T, U extends string> {
  @Input() _id: string;
  @Input() label = '';
  @Input() value: T;
  @Input() placeholder = '';
  @Input() optionGroups?: SelectOptionGroup<T>[] = [];
  @Input() options?: SelectOption<T>[] = [];
  @Input() clearable = false;
  @Input() disabled = false;
  @Input() formName: string;
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() formValidation: FormValidation<U>;
  @Output() select = new EventEmitter<T>();
  @ViewChild('selectRef') selectRef: MatSelect;

  constructor() {}

  get valued() {
    return typeof this.value === 'object' &&
      this.value !== null &&
      'value' in this.value
      ? this.value['value']
      : this.value;
  }

  get formControl() {
    const name = this.formName as keyof typeof this.formGroup.controls;
    return name ? this.formGroup.controls[name] : undefined;
  }

  get errorMessage() {
    const name = this.formName as keyof typeof this.formValidation;
    return this.formValidation && this.formValidation[name];
  }

  ngOnInit() {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      await sleep(1); // wait until dom element drawing is finished
      this.selectRef.options.forEach((data) => {
        if (jsonUtil.equals(data.value, this.value)) data.select();
        else data.deselect();
      });
    }
    if (changes['disabled'] && this.formControl) {
      this.disabled ? this.formControl.disable() : this.formControl.enable();
    }
  }

  _select(v: T) {
    this.select.emit(v);
  }

  clear(e: Event) {
    e.stopPropagation();
    this._select('' as T);
  }
}

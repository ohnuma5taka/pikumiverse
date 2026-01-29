import { baseModules } from '@/app/app.config';
import { SelectOption } from '@/app/core/models/select.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './app-radio.component.html',
  styleUrls: ['./app-radio.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppRadioComponent<T> {
  @Input() value: T;
  @Input() options: SelectOption<T>[];
  @Input() horizontal = false;
  @Output() select = new EventEmitter<T>();

  ngOnInit() {}
  _select(v: T) {
    this.select.emit(v);
  }
}

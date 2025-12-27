import { baseModules } from '@/app/app.config';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-item',
  templateUrl: './app-form-item.component.html',
  styleUrls: ['./app-form-item.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppFormItemComponent {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() help?: string = '';
  @Input() value?: string;
  @Input() width?: number | 'auto' = 0;
  @Input() valueClass?: string = '';

  get valued() {
    return typeof this.value !== 'undefined';
  }
  ngOnInit() {}
}

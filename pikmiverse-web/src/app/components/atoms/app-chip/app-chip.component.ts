import { baseModules } from '@/app/app.config';
import { Component, Input } from '@angular/core';

export type ChipMode = 'success' | 'alert' | 'warn' | '';

@Component({
  selector: 'app-chip',
  templateUrl: './app-chip.component.html',
  styleUrls: ['./app-chip.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppChipComponent {
  @Input() _id: string;
  @Input() label: string;
  @Input() mode: ChipMode = '';
  @Input() outlined = false;
  @Input() height = 20;

  get _class() {
    return [this.outlined ? 'outlined' : '', this.mode].join(' ');
  }

  get fontSize() {
    return this.height * 0.55;
  }
}

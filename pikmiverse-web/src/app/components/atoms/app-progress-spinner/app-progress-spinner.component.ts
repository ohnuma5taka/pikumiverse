import { baseModules } from '@/app/app.config';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './app-progress-spinner.component.html',
  styleUrls: ['./app-progress-spinner.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppProgressSpinnerComponent {
  @Input() loading = false;
  @Input() size = 32;
  @Input() message = '';
  constructor() {}

  ngOnInit() {}
}

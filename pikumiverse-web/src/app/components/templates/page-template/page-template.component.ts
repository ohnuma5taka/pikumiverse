import { Component } from '@angular/core';
import { templateModules } from '@/app/app.config';

@Component({
  selector: 'page-template',
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.scss'],
  standalone: true,
  imports: templateModules,
})
export class PageTemplateComponent {
  constructor() {}
  ngOnInit() {}
}

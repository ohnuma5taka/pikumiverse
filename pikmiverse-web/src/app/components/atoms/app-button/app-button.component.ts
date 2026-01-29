import { baseModules } from '@/app/app.config';
import { ColorMode } from '@/app/core/models/color.model';
import { mediaUtil } from '@/app/core/utils/media.util';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppButtonComponent {
  @Input() _id: string;
  @Input() colorMode: ColorMode = 'default';
  @Input() outlined = false;
  @Input() transparent = false;
  @Input() borderWidth = 1.5;
  @Input() borderRadius = 4;
  @Input() borderStyle: 'solid' | 'dashed' = 'solid';
  @Input() width = 0;
  @Input() height = 36;
  @Input() buttonClass = '';
  @Input() tooltip = '';
  @Input() rounded = false;
  @Input() circled = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Output() emitClick = new EventEmitter<void>();
  @ViewChild('buttonRef') buttonRef: ElementRef;
  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  isMobile = mediaUtil.isMobile;

  get _buttonClass() {
    return [
      ...this.buttonClass.split(' '),
      this.colorMode,
      this.disabled ? 'disabled' : '',
      this.outlined ? 'outlined' : '',
      this.transparent ? 'transparent' : '',
    ].join(' ');
  }

  get size() {
    return Math.max(this.width, this.height);
  }

  get loadingSpinnerSize() {
    return this.buttonRef?.nativeElement.clientHeight * 0.6 || 10;
  }
  ngOnInit() {}
  ngAfterViewChecked() {
    if (this.borderStyle === 'dashed')
      this.buttonRef.nativeElement.style.borderStyle = this.borderStyle;
    this.changeDetectionRef.detectChanges();
  }

  click(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;
    this.emitClick.emit();
  }
}

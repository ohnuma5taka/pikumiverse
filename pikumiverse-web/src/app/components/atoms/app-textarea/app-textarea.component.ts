import { baseModules } from '@/app/app.config';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './app-textarea.component.html',
  styleUrls: ['./app-textarea.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppTextareaComponent {
  @Input() _id: string;
  @Input() dense = false;
  @Input() value = '';
  @Input() disabled = false;
  @Input() placeholder = '';
  @Input() autosize = false;
  @Input() minRows = 3;
  @Output() emitInput = new EventEmitter<string>();
  @Output() submit = new EventEmitter<string>();
  @Output() blur = new EventEmitter();
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('textareaRef', { read: ElementRef })
  textareaRef!: ElementRef<HTMLTextAreaElement>;
  constructor() {}

  passwordShowing = false;
  imeComposing = false;

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.textareaRef) {
      console.log('xxx');

      return;
    }
    this.textareaRef.nativeElement.addEventListener('input', (e: any) => {
      const imeTypes = [
        'insertCompositionText',
        'deleteCompositionText',
        'insertFromComposition',
        'deleteByComposition',
      ];
      this.imeComposing = imeTypes.includes(e.inputType);
    });
    // const observer = new ResizeObserver(() => {
    //   this.wrapper.nativeElement.style.height =
    //     this.textareaRef.nativeElement.style.height;
    // });
    // observer.observe(this.textareaRef.nativeElement);
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

  _blur() {
    this.blur.emit();
  }
}

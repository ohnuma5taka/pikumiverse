import { baseModules } from '@/app/app.config';
import { FormValidation } from '@/app/core/services/form.service';
import { momentUtil } from '@/app/core/utils/moment.util';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
  MatDatepicker,
} from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calendar-header',
  template: `
    <div class="d-flex align-center py-2 px-4">
      <button
        class="clickable-button calendar-header-move-button mr-auto"
        mat-icon-button
        [disabled]="prevDisabled"
        (click)="moveMonth(-1)"
      >
        <span class="mdi mdi-chevron-left"></span>
      </button>
      <button
        mat-button
        class="clickable-button calendar-header-period-button year-button"
        (click)="periodClicked('multi-year')"
      >
        {{ yearLabel }}
      </button>
      <button
        mat-button
        class="clickable-button calendar-header-period-button month-button"
        (click)="periodClicked('year')"
      >
        {{ monthLabel }}
      </button>
      <button
        class="clickable-button calendar-header-move-button ml-auto"
        mat-icon-button
        [disabled]="nextDisabled"
        (click)="moveMonth(1)"
      >
        <span class="mdi mdi-chevron-right"></span>
      </button>
    </div>
  `,
  styles: [
    `
      .clickable-button {
        text-align: center;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .clickable-button:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
      .clickable-button[disabled] {
        cursor: default;
        background-color: transparent;
      }
      .calendar-header-period-button {
        padding: 4px 8px;
        font-size: 16px;
        border-radius: 4px;
      }
      .calendar-header-move-button {
        width: 36px;
        height: 36px;
        padding: 0;
        font-size: 28px;
        line-height: 36px;
        border-radius: 100px;
      }
    `,
  ],
})
export class AppCalendarHeaderComponent<D extends Moment> {
  private destroyed = new Subject<void>();

  constructor(
    private calendar: MatCalendar<D>,
    private dateAdapter: DateAdapter<D>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.changeDetectorRef.markForCheck());
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  get yearLabel() {
    return this.dateAdapter.format(this.calendar.activeDate, 'YYYY年');
  }

  get monthLabel() {
    return this.dateAdapter.format(this.calendar.activeDate, 'M月');
  }

  get prevDisabled(): boolean {
    if (!this.calendar.minDate) return false;
    const prevMonth = this.dateAdapter.addCalendarMonths(
      this.calendar.activeDate,
      -1
    );
    return prevMonth < this.calendar.minDate;
  }

  get nextDisabled(): boolean {
    if (!this.calendar.maxDate) return false;
    const nextMonth = this.dateAdapter.addCalendarMonths(
      this.calendar.activeDate,
      1
    );
    return nextMonth > this.calendar.maxDate;
  }

  moveMonth(count: number) {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(
      this.calendar.activeDate,
      count
    );
  }

  periodClicked(view: 'month' | 'year' | 'multi-year') {
    this.calendar.currentView = view;
  }
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './app-date-picker.component.html',
  styleUrls: ['./app-date-picker.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppDatePickerComponent {
  @Input() _id: string;
  @Input() label = '';
  @Input() value: string | null;
  @Input() min: string | null;
  @Input() max: string | null;
  @Input() placeholder = '';
  @Input() tooltip = '';
  @Input() disabled = false;
  @Input() formName = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() formValidation?: FormValidation<string>;
  @Output() emitInput = new EventEmitter<string>();
  @ViewChild('picker') picker!: MatDatepicker<Date>;
  dateClass: MatCalendarCellClassFunction<string> = (_, view) =>
    view === 'month' && !this.value ? 'unselected' : '';
  appCalendarHeaderComponent = AppCalendarHeaderComponent;

  constructor() {}

  get formControl() {
    const name = this.formName as keyof typeof this.formGroup.controls;
    return name ? this.formGroup.controls[name] : undefined;
  }

  get errorMessage() {
    const name = this.formName as keyof typeof this.formValidation;
    return this.formValidation && this.formValidation[name];
  }

  updateClickEvent() {
    const buttons = document.querySelectorAll(
      'button.mat-calendar-body-cell:not(.mat-calendar-body-disabled)'
    );
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.getAttribute('aria-label');
        this._input(value);
      });
    });
    const button = document.querySelector(
      'button.mat-calendar-body-cell.mat-calendar-body-active'
    );
    if (button && button.getAttribute('aria-label') === this.value) {
      button.classList.add('active-date');
    }
  }

  ngAfterViewInit() {
    this.picker.openedStream.subscribe(() => {
      setTimeout(() => {
        this.updateClickEvent();
        const calendarEl = document.querySelector('.mat-calendar');
        if (!calendarEl) return;
        const observer = new MutationObserver(() => {
          setTimeout(() => this.updateClickEvent());
        });
        observer.observe(calendarEl, { childList: true, subtree: true });
      }, 0);
    });
    this.picker.viewChanged.subscribe((e) => {
      if (e.includes('year')) return;
      setTimeout(() => {
        this.updateClickEvent();
      }, 0);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled'] && this.formControl) {
      this.disabled ? this.formControl.disable() : this.formControl.enable();
    }
  }

  _input(v: string | null) {
    this.emitInput.emit(
      v === null ? '' : momentUtil.date(v).format('YYYY-MM-DD')
    );
    this.picker.close();
  }
}

import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatRippleModule,
} from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppButtonComponent } from '@/app/components/atoms/app-button/app-button.component';
import { AppButtonGroupComponent } from '@/app/components/atoms/app-button-group/app-button-group.component';
import { AppChipComponent } from '@/app/components/atoms/app-chip/app-chip.component';
import { AppInputComponent } from '@/app/components/atoms/app-input/app-input.component';
import { AppProgressSpinnerComponent } from '@/app/components/atoms/app-progress-spinner/app-progress-spinner.component';
import { AppRadioComponent } from '@/app/components/atoms/app-radio/app-radio.component';
import { AppSelectComponent } from '@/app/components/atoms/app-select/app-select.component';
import { AppTextareaComponent } from '@/app/components/atoms/app-textarea/app-textarea.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppPopupComponent } from '@/app/components/atoms/app-popup/app-popup.component';
import { AppFormItemComponent } from '@/app/components/atoms/app-form-item/app-form-item.component';
import { MatSortModule } from '@angular/material/sort';
import { EditDialogTemplateComponent } from '@/app/components/templates/edit-dialog-template/edit-dialog-template.component';
import { PageTemplateComponent } from '@/app/components/templates/page-template/page-template.component';
import { MatSelectModule } from '@angular/material/select';
import { PageTitleStrategy } from '@/app/core/strategies/title.strategy';
import { StoreService } from '@/app/core/services/store.service';
import { ApiService } from '@/app/core/services/api.service';
import { FormService } from '@/app/core/services/form.service';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiInterceptor } from '@/app/core/interceptors/api.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppDatePickerComponent } from '@/app/components/atoms/app-date-picker/app-date-picker.component';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { ConfirmDialogComponent } from '@/app/components/modules/confirm-dialog/confirm-dialog.component';
import { TeamWebsocket } from '@/app/core/ws/team.ws';

const commonModules = [CommonModule, FormsModule, ReactiveFormsModule];
const materialModules = [
  DragDropModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
];
const atomComponents = [
  AppButtonComponent,
  AppButtonGroupComponent,
  AppChipComponent,
  AppDatePickerComponent,
  AppFormItemComponent,
  AppInputComponent,
  AppPopupComponent,
  AppProgressSpinnerComponent,
  AppRadioComponent,
  AppSelectComponent,
  AppTextareaComponent,
];
const moduleComponents = [ConfirmDialogComponent];
const dialogComponents = [];
const templateComponents = [EditDialogTemplateComponent, PageTemplateComponent];

export const baseModules = [...commonModules, ...materialModules];
export const moduleModules = [...baseModules, ...atomComponents];
export const dialogModules = [...moduleModules, ...moduleComponents];
export const templateModules = [...dialogModules];
export const pageModules = [...templateModules, ...templateComponents];

export const appServices = [
  ApiService,
  FormService,
  SnackbarService,
  StoreService,
];

export const DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'YYYY MMM',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    TeamWebsocket,
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    importProvidersFrom(...baseModules),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    ...appServices.map((provide) => ({ provide })),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
};

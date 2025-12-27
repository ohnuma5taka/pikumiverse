import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  Observable,
  of,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { env } from '@/environments/env';

export enum ValidationTypeEnum {
  required = 'required',
  requiredTrue = 'requiredTrue',
  email = 'email',
  pattern = 'pattern',
  min = 'min',
  max = 'max',
  minLength = 'minlength',
  maxLength = 'maxlength',
  matchSource = 'matchSource',
  match = 'match',
  compose = 'compose',
  currentPasswordAsync = 'currentPasswordAsync', // added async validation
}

export type ValidationItem = {
  type: ValidationTypeEnum;
  param?: any;
  patternName?: string; // optional property to name patterns uniquely
};

export type FormControlValidation = ValidationItem & {
  validations?: ValidationItem[];
  errorMessage: string;
};

export type FormControlConfig<T extends string> = {
  [key in T]: {
    initialValue?: any;
    validations: FormControlValidation[];
  };
};

export type FormValidation<T extends string> = {
  [key in T]: string;
};

export type FormErrorMessageMap<T extends string> = {
  [key in T]: Map<string, string>;
};

type PasswordAsyncResponse = { data: boolean } | null;

@Injectable({ providedIn: 'root' })
export class FormService<T extends string> {
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  formGroup: FormGroup = new FormGroup({});
  _formValidation = {} as FormValidation<T>;
  errorMessageMap: FormErrorMessageMap<T>;

  get formValidation(): FormValidation<T> {
    Object.keys(this.formGroup.controls).forEach((key) => {
      const control = this.formGroup.controls[key];
      const errorMessage =
        control.invalid && (control.touched || control.dirty) && control.errors
          ? this.errorMessageMap[key as T].get(
              Object.keys(control.errors)[0] as string
            )
          : '';
      this._formValidation[key as T] = errorMessage || '';
    });
    return this._formValidation;
  }

  init(config: FormControlConfig<T>) {
    this.formGroup = this.formBuilder.group(
      Object.keys(config)
        .filter((key) => config[key as T])
        .reduce(
          (ret, key) => ({
            ...ret,
            [key as T]: new FormControl(
              config[key as T].initialValue,
              this.getValidations(config[key as T].validations),
              this.getAsyncValidations(config[key as T].validations)
            ),
          }),
          {}
        )
    );
    this.errorMessageMap = Object.keys(config).reduce(
      (ret, key) =>
        Object.assign(ret, {
          [key]: new Map(
            config[key as T].validations.map((validation) => [
              validation.type === 'pattern' && validation.patternName
                ? validation.type + validation.patternName
                : validation.type,
              validation.errorMessage,
            ])
          ),
        }),
      {} as FormErrorMessageMap<T>
    );
    return this.formGroup;
  }

  updateErrorMessages(config: FormControlConfig<T>) {
    this.errorMessageMap = Object.keys(config).reduce(
      (ret, key) =>
        Object.assign(ret, {
          [key as T]: new Map(
            config[key as T].validations.map((validation) => [
              validation.type === 'pattern' && validation.patternName
                ? validation.type + validation.patternName
                : validation.type,
              validation.errorMessage,
            ])
          ),
        }),
      {} as FormErrorMessageMap<T>
    );
  }

  getValidations(validations: FormControlValidation[]): ValidatorFn[] {
    return validations
      .filter((validation) => this.isSyncValidator(validation.type))
      .map((validation: FormControlValidation) => {
        switch (validation.type) {
          case ValidationTypeEnum.required:
            return Validators.required;
          case ValidationTypeEnum.requiredTrue:
            return Validators.requiredTrue;
          case ValidationTypeEnum.pattern:
            if (validation.patternName) {
              return (control: AbstractControl): ValidationErrors | null => {
                const patternValidator = Validators.pattern(
                  validation.param as RegExp
                );
                const result = patternValidator(control);
                if (result && result['pattern']) {
                  return {
                    [`pattern${validation.patternName}`]: result['pattern'],
                  };
                }
                return null;
              };
            } else {
              return Validators.pattern(validation.param as RegExp);
            }
          case ValidationTypeEnum.min:
            return Validators.min(validation.param as number);
          case ValidationTypeEnum.max:
            return Validators.max(validation.param as number);
          case ValidationTypeEnum.minLength:
            return Validators.minLength(validation.param as number);
          case ValidationTypeEnum.maxLength:
            return Validators.maxLength(validation.param as number);
          case ValidationTypeEnum.matchSource:
            return this.matchValidator(validation.param as string, true);
          case ValidationTypeEnum.match:
            return this.matchValidator(validation.param as string);
          case ValidationTypeEnum.compose:
            return Validators.compose(
              this.getValidations(
                validation.validations as FormControlValidation[]
              )
            );
          default:
            return null;
        }
      })
      .filter((x): x is ValidatorFn => !!x);
  }

  getAsyncValidations(
    validations: FormControlValidation[]
  ): AsyncValidatorFn[] {
    return validations
      .filter((validation) => this.isAsyncValidator(validation.type))
      .map((validation: FormControlValidation) => {
        switch (validation.type) {
          case ValidationTypeEnum.currentPasswordAsync:
            return this.currentPasswordAsyncValidator(
              validation.param as string
            );
          default:
            return null;
        }
      })
      .filter((x): x is AsyncValidatorFn => !!x);
  }

  private isSyncValidator(type: ValidationTypeEnum): boolean {
    return [
      ValidationTypeEnum.required,
      ValidationTypeEnum.requiredTrue,
      ValidationTypeEnum.email,
      ValidationTypeEnum.pattern,
      ValidationTypeEnum.min,
      ValidationTypeEnum.max,
      ValidationTypeEnum.minLength,
      ValidationTypeEnum.maxLength,
      ValidationTypeEnum.matchSource,
      ValidationTypeEnum.match,
      ValidationTypeEnum.compose,
    ].includes(type);
  }

  private isAsyncValidator(type: ValidationTypeEnum): boolean {
    return [ValidationTypeEnum.currentPasswordAsync].includes(type);
  }

  matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { [ValidationTypeEnum.match]: true };
    };
  }

  currentPasswordAsyncValidator(email: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const path = `/users/${email}/validatePassword`;
      const body = { password: control.value };
      return (
        env.mode !== 'test'
          ? this.http.post<PasswordAsyncResponse>(path, body)
          : of({ data: control.value === 'test' }).pipe(delay(300))
      ).pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        map((res) =>
          res && Object.keys(res).length ? { currentPasswordAsync: true } : null
        )
      );
    };
  }
}

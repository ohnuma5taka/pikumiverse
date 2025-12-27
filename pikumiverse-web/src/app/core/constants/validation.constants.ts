import {
  FormControlValidation,
  ValidationTypeEnum,
} from '@/app/core/services/form.service';
import { stringUtil } from '@/app/core/utils/string.util';

const required = (msg?: string, name?: string): FormControlValidation => ({
  type: ValidationTypeEnum.required,
  errorMessage: msg || '必須項目です',
  patternName: name || `required_${stringUtil.randomString()}`,
});
const maxLength = (length: number, msg?: string, name?: string) => ({
  type: ValidationTypeEnum.maxLength,
  param: length,
  errorMessage: msg || `最大${length}文字まで使用できます`,
  patternName: name || `maxLength_${stringUtil.randomString()}`,
});
const minLength = (length: number, msg?: string, name?: string) => ({
  type: ValidationTypeEnum.minLength,
  param: length,
  errorMessage: msg || `${length}文字以上入力してください`,
  patternName: name || `minLength_${stringUtil.randomString()}`,
});
const halfAlphaNum = (msg?: string, name?: string) => ({
  type: ValidationTypeEnum.pattern,
  param: '^[a-zA-Z0-9]+$',
  errorMessage: msg || '半角英数字のみ使用できます',
  patternName: name || `halfAlphaNum_${stringUtil.randomString()}`,
});
const pattern = (pattern: string, msg?: string, name?: string) => ({
  type: ValidationTypeEnum.pattern,
  param: new RegExp(pattern),
  errorMessage: msg || '使用できない文字が含まれています',
  patternName: name || `pattern_${stringUtil.randomString()}`,
});
const match = (target: string, msg?: string, name?: string) => ({
  type: ValidationTypeEnum.match,
  param: target,
  errorMessage: msg || '値が一致しません',
  patternName: name || `match_${stringUtil.randomString()}`,
});
const email = (msg?: string, name?: string) => ({
  type: ValidationTypeEnum.pattern,
  param: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  errorMessage: msg || '正しいメールアドレスを入力してください',
  patternName: name || `email_${stringUtil.randomString()}`,
});
const currentPasswordAsync = (email: string, msg?: string, name?: string) => ({
  type: ValidationTypeEnum.currentPasswordAsync,
  param: email,
  errorMessage: msg || '現在のパスワードが間違っています',
  patternName: name || `currentPasswordAsync_${stringUtil.randomString()}`,
});

export const validationRule = {
  required,
  maxLength,
  minLength,
  halfAlphaNum,
  pattern,
  match,
  email,
  currentPasswordAsync,
};

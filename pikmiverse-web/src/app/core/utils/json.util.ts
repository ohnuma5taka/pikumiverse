import _ from 'lodash';

const stringify = <T>(obj: T) => JSON.stringify(obj);
const parse = <T>(objString: string): T =>
  JSON.parse(objString.replace(/\n/g, '\\n'));
const deepCopy = <T>(obj: T): T => _.cloneDeep(obj);
const equals = <T, U>(obj1: T, obj2: U): boolean =>
  stringify(obj1) === stringify(obj2);
const isEmpty = <T>(obj: T) => equals(obj, {});
const snakeToCamel = (str: string) =>
  str.split('_').reduce((acc, curr, i) => {
    curr = i !== 0 ? curr[0].toUpperCase() + curr.slice(1) : curr;
    return acc + curr;
  }, '');
const kebabToCamel = (str: string) =>
  str.split('-').reduce((acc, curr, i) => {
    curr = i !== 0 ? curr[0].toUpperCase() + curr.slice(1) : curr;
    return acc + curr;
  }, '');
const toCamelCase = (object: unknown): unknown => {
  if (object === null || typeof object !== 'object') return object;
  if (Array.isArray(object)) return object.map((x) => toCamelCase(x));
  const result: Record<string, any> = {};
  const original = object as Record<string, any>;
  Object.keys(original).forEach((key) => {
    const camelKey = snakeToCamel(key);
    result[camelKey] = toCamelCase(original[key]);
  });
  return result;
};
const camelToSnake = (str: string) =>
  str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
const toSnakeCase = (object: unknown): unknown => {
  if (object === null || typeof object !== 'object') return object;
  if (Array.isArray(object)) return object.map((x) => toSnakeCase(x));
  const result: Record<string, any> = {};
  const original = object as Record<string, any>;
  Object.keys(original).forEach((key) => {
    const camelKey = camelToSnake(key);
    result[camelKey] = toSnakeCase(original[key]);
  });
  return result;
};

export const jsonUtil = {
  stringify,
  parse,
  deepCopy,
  equals,
  isEmpty,
  kebabToCamel,
  snakeToCamel,
  camelToSnake,
  toSnakeCase,
  toCamelCase,
};

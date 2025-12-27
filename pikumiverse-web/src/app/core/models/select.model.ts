export type SelectOptionGroup<T> = {
  label: string;
  value?: string;
  options?: SelectOption<T>[];
};

export type SelectOption<T> = {
  label: string;
  disabled?: boolean;
  value: T;
};

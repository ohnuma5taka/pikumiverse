import { ColorMode } from '@/app/core/models/color.model';

export type ConfirmDialogData = {
  _id: string;
  title: string;
  icon?: string;
  iconHidden?: boolean;
  description?: string;
  action: {
    close: {
      label: string;
    };
    confirm?: {
      label: string;
      colorMode: ColorMode;
    };
  };
};

export type ConfirmDialogAction<T> = {
  action: 'confirm' | 'cancel' | 'release';
  data?: T;
};

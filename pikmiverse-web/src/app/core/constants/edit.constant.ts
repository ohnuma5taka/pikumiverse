import { EditType } from '@/app/core/models/edit-type.model';

export const editMap = new Map<EditType, string>([
  ['create', '登録'],
  ['update', '更新'],
  ['delete', '削除'],
]);

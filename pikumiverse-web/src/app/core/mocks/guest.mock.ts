import { Guest } from '@/app/core/models/guest.model';
import { sleep } from '@/app/core/utils/time.util';

export const mockGuests: Guest[] = [
  {
    name: '大沼貴信',
    team_name: '大沼家',
    score: 0,
  },
  {
    name: '大沼善信',
    team_name: '大沼家',
    score: 0,
  },
  {
    name: '大沼千秋',
    team_name: '大沼家',
    score: 0,
  },
  {
    name: '山田琴子',
    team_name: '山田家',
    score: 0,
  },
  {
    name: '山田慶具',
    team_name: '山田家',
    score: 0,
  },
  {
    name: '山田香代',
    team_name: '山田家',
    score: 0,
  },
  {
    name: '興野悠太郎',
    team_name: '興野家',
    score: 0,
  },
  {
    name: '興野朝未',
    team_name: '興野家',
    score: 0,
  },
];
export const getMockGuests = async (): Promise<Guest[]> => {
  await sleep(300);
  return mockGuests;
};

export const getMockGuest = async (name: string): Promise<Guest> => {
  await sleep(300);
  return mockGuests.find((x) => x.name === name)!;
};

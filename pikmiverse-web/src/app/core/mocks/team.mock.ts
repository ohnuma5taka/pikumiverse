import { Team } from '@/app/core/models/team.model';
import { sleep } from '@/app/core/utils/time.util';

export const mockTeams: Team[] = [
  { name: '大沼家', score: 0 },
  { name: '山田家', score: 0 },
  { name: '興野家', score: 0 },
];
export const getMockTeams = async (): Promise<Team[]> => {
  await sleep(300);
  return mockTeams;
};

export const getMockTeam = async (name: string): Promise<Team> => {
  await sleep(300);
  return mockTeams.find((x) => x.name === name)!;
};

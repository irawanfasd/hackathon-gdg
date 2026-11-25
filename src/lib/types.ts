export type AchievementLevel = 'campus' | 'regional' | 'national' | 'international';

export type BadgeStatus =
  | 'PROCESSING'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'FAILED'
  | 'FORMING'
  | 'READY'
  | 'CLOSED'
  | 'DRAFT_AI'
  | 'STUDENT_CONFIRMED'
  | 'VERIFIED';

export type Competition = {
  id: string;
  title: string;
  organizer: string;
  field: string;
  deadline: string; // ISO date string
  min_team_size: number;
  max_team_size: number;
  poster_url?: string;
};

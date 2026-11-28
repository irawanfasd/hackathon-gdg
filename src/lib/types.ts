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

// Teks yang dicetak di poster otomatis (dipakai bila poster_url belum ada).
export type PosterCopy = {
  no: string; // angka besar, mis. "01"
  tagline: string;
  label: string; // baris kecil di bawah poster
};

export type Competition = {
  id: string;
  title: string;
  organizer: string;
  field: string;
  deadline: string; // ISO date string
  min_team_size: number;
  max_team_size: number;
  level?: AchievementLevel;
  description?: string;
  eligibility?: string;
  registration_url?: string;
  poster_url?: string;
  poster?: PosterCopy;
};

export type TeamMember = { name: string; whatsapp?: string };

export type Team = {
  id: string;
  competition_id: string;
  name: string;
  status: 'FORMING' | 'READY';
  leader: { name: string; role: string };
  roles: string[]; // FORMING: peran yang dicari. READY: peran yang sudah terisi.
  skills: string[];
  members: TeamMember[];
  capacity: number;
};

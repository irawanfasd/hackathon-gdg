// Mengikuti skema final blueprint v2. Semua data lewat /api/..., bukan supabase.from() di client.
export type CompetitionStatus = 'PROCESSING' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'FAILED';
export type TeamStatus = 'FORMING' | 'READY' | 'CLOSED';
export type AchievementStatus = 'DRAFT_AI' | 'STUDENT_CONFIRMED' | 'VERIFIED' | 'REJECTED';
export type AchievementLevel = 'campus' | 'regional' | 'national' | 'international';
export type BadgeStatus = CompetitionStatus | TeamStatus | AchievementStatus;

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  field: string;
  min_team_size: number;
  max_team_size: number;
  eligibility_note: string;
  deadline: string; // ISO, zona WIB
  raw_deadline_text: string;
  registration_url: string;
  poster_url: string | null;
  status: CompetitionStatus;
}

export interface TeamMember {
  user_id: string;
  full_name: string;
  is_leader: boolean;
  role_assigned: string;
  contact_info?: string | null; // API hanya mengirim ini saat tim READY
}

export interface TeamRequest {
  id: string;
  competition_id: string;
  title: string;
  leader_role: string;
  required_roles: string[];
  required_skills: string[];
  status: TeamStatus;
  members: TeamMember[];
}

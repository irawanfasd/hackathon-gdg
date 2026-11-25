import type { Competition, TeamRequest } from './types';

// Data sintetis untuk demo. Ganti dengan api('/competitions') saat endpoint siap.
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();

export const competitions: Competition[] = [
  { id: 'c1', title: 'Hackathon Kampus Digital', organizer: 'Himpunan Informatika', field: 'IT', min_team_size: 2, max_team_size: 3, eligibility_note: 'Mahasiswa aktif S1 semua jurusan.', deadline: day(2), raw_deadline_text: '27 Nov', registration_url: 'https://example.com/c1', poster_url: null, status: 'APPROVED' },
  { id: 'c2', title: 'Lomba Poster Lingkungan', organizer: 'UKM Desain', field: 'Design', min_team_size: 1, max_team_size: 1, eligibility_note: 'Individu, terbuka untuk semua fakultas.', deadline: day(6), raw_deadline_text: '1 Des', registration_url: 'https://example.com/c2', poster_url: null, status: 'APPROVED' },
  { id: 'c3', title: 'Karya Tulis Ilmiah Nasional', organizer: 'BEM Fakultas Ekonomi', field: 'Essay', min_team_size: 1, max_team_size: 2, eligibility_note: 'Mahasiswa D3 dan S1.', deadline: day(19), raw_deadline_text: '14 Des', registration_url: 'https://example.com/c3', poster_url: null, status: 'APPROVED' },
  { id: 'c4', title: 'Business Case Competition', organizer: 'Himpunan Manajemen', field: 'Business', min_team_size: 3, max_team_size: 4, eligibility_note: 'Tim lintas jurusan diutamakan.', deadline: day(-3), raw_deadline_text: '22 Nov', registration_url: 'https://example.com/c4', poster_url: null, status: 'APPROVED' },
];

export const teams: TeamRequest[] = [
  { id: 't1', competition_id: 'c1', title: 'Tim Pencari Frontend', leader_role: 'Backend', required_roles: ['Frontend', 'UI/UX'], required_skills: ['React', 'Figma'], status: 'FORMING',
    members: [{ user_id: 'u1', full_name: 'Andra', is_leader: true, role_assigned: 'Backend' }] },
  { id: 't2', competition_id: 'c1', title: 'Squad Data', leader_role: 'Data Analysis', required_roles: [], required_skills: [], status: 'READY',
    members: [
      { user_id: 'u2', full_name: 'Yoga', is_leader: true, role_assigned: 'Data Analysis', contact_info: '0812-0000-0001' },
      { user_id: 'u3', full_name: 'Irawan', is_leader: false, role_assigned: 'Frontend', contact_info: '0812-0000-0002' },
    ] },
];

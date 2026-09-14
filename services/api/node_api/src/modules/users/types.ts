export interface UserProfile {
  userId: string;
  fullName: string;
  course: string | null;
  yearLevel: string | null;
  avatarUrl: string | null;
  bio: string | null;
}
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  fullName: string;
  body: string;
  createdAt: Date;
}
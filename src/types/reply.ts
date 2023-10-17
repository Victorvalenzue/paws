export interface CommentReply {
  idField?: string;
  profileId: string;
  profileImageURL: string;
  profileName: string;
  content: string;
  createdAt: number;
  likes: number;
}

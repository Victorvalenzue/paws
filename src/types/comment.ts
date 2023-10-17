import { CommentReply } from './reply';

export interface PublicationComment {
  idField?: string;
  profileId: string;
  profileName: string;
  profileImageURL: string;
  content: string;
  createdAt: number;
  likes: number;
}

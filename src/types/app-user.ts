import { Being } from './beign';

export interface Follower extends Being {
  since: number;
}

export interface Following extends Being {
  since: number;
}

export interface AppUser extends Being {
  idField?: string;
  active: boolean;
  createdAt: number;
  followers: number;
  following: number;
  publications: number;
  email: string;
  verified: boolean;
  tags: string[];
  likes: string[];
}

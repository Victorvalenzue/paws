import { Being } from './beign';

export interface AppNotification extends Being {
  content: string;
  route: string;
}

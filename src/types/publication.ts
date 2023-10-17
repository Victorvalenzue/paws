import { Being } from './beign';
import { PublicationComment } from './comment';
import { ApplicationForm } from './form';
import { Pet } from './pet';

export enum PublicationType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  LINK = 'LINK',
  FORM = 'FORM',
  ADOPTION = 'ADOPTION',
  BLOG = 'BLOG',
  SERVICE = 'SERVICE',
}

export interface Video {
  poster: string;
  url: string;
}

export interface PublicationMetadata {
  images?: string[];
  video?: Video;
  gifs?: string[];
  text: string;
}

export enum AdoptionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  ADOPTED = 'ADOPTED',
  CANCELLED = 'CANCELLED',
}

export interface AdoptionMetadata {
  location: string;
  lat: number;
  long: number;
  age: number;
  pet: Pet;
  status: AdoptionStatus;
  applicants: number;
  limit: number;
  endTime: number;
  finishedAt: number;
}

export interface Like extends Being {}

export interface Publication extends Being {
  idField?: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  content: PublicationMetadata;
  applicationForm?: ApplicationForm;
  adoption?: AdoptionMetadata;
  type: PublicationType;
  likes: number;
  verified: boolean;
}

import { Being } from './beign';

export enum ApplicantStatus {
  PENDING = 'PENDING',
  APPROBED = 'APPROBED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface AdoptionApplicant extends Being {
  status: ApplicantStatus;
}

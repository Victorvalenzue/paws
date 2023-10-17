import { Being } from './beign';

export enum PetSpecie {
  DOG = 'DOG',
  CAT = 'CAT',
  RABBIT = 'RABBIT',
  BIRD = 'BIRD',
  REPTILE = 'REPTILE',
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface OwnerTrack extends Being {
  idField?: string;
  since: number;
  to: number;
}

export interface Pet extends Being {
  idField?: string;
  breed: string;
  color: string;
  ownerId: string;
  isAdopted: boolean;
  adoptionDate: number;
  species: PetSpecie;
  gender: PetGender;
}

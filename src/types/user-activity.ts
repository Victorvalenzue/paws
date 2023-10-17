import { ADOPTION, GROOMING, RIDE, VETERINARY } from 'src/utils/assets';
import { ApplicantStatus } from './adoption-applicant';
import { Being } from './beign';

export enum UserActivityType {
  ADOPTION = 'ADOPTION',
  FORM = 'FORM',
  APPOINTMENT = 'APPOINTMENT',
}

export enum UserActivityStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface AdoptionFormMetadata {
  publicationId: string;
  status: ApplicantStatus;
}

export enum AppointmentType {
  MEDICAL = 'MEDICAL',
  RIDE = 'RIDE',
  GROOMING = 'GROOMING',
  FEEDING = 'FEEDING',
  PLAYTIME = 'PLAYTIME',
  TRAINING = 'TRAINING',
  ADOPTION = 'ADOPTION',
}

export interface AppointmentMetadata extends Being {
  date: number;
  type: AppointmentType;
  location: string;
  lat: number;
  long: number;
  comments: string;
}

export interface UserActivity {
  idField?: string;
  name: string;
  description: string;
  createdAt: number;
  type: UserActivityType;
  status: UserActivityStatus;
  adoptionMetadata?: AdoptionFormMetadata;
  appointmentMetadata?: AppointmentMetadata;
}

export const activityTypes = [
  {
    id: UserActivityType.APPOINTMENT,
    value: 'Cita',
  },
  {
    id: UserActivityType.ADOPTION,
    value: 'Adopción',
  },
];

export const appointmentStatus = [
  {
    id: UserActivityStatus.PENDING,
    value: 'Pendiente',
    image: 'time-outline',
    color: 'secondary',
  },
  {
    id: UserActivityStatus.CANCELLED,
    value: 'Cancelado',
    image: 'time-outline',
    color: 'danger',
  },
  {
    id: UserActivityStatus.COMPLETED,
    value: 'Completado',
    image: 'checkmark-done-outline',
    color: 'success',
  },
];

export const applicantStatus = [
  {
    id: ApplicantStatus.PENDING,
    value: 'Pendiente',
    image: 'time-outline',
    color: 'secondary',
  },
  {
    id: ApplicantStatus.CANCELLED,
    value: 'Cancelado',
    image: 'time-outline',
    color: 'danger',
  },
  {
    id: ApplicantStatus.REJECTED,
    value: 'Cancelado',
    image: 'trash-outline',
    color: 'danger',
  },
  {
    id: ApplicantStatus.APPROBED,
    value: 'Completado',
    image: 'checkmark-done-outline',
    color: 'success',
  },
];

export const appointmentTypes = [
  {
    id: AppointmentType.GROOMING,
    value: 'Estética',
    image: GROOMING,
  },
  {
    id: AppointmentType.RIDE,
    value: 'Paseo',
    image: RIDE,
  },
  {
    id: AppointmentType.MEDICAL,
    value: 'Veterinario',
    image: VETERINARY,
  },
  {
    id: AppointmentType.ADOPTION,
    value: 'Adopción',
    image: ADOPTION,
  },
];

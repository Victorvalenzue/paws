export enum FormType {
  TEXT = 'TEXT',
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  EMAIL = 'EMAIL',
  SELECT = 'SELECT',
  SELECT_SEARCH = 'SELECT_SEARCH',
  PHONE = 'PHONE',
}

export interface FormOption {
  id: number;
  name: string;
}

export interface FormField {
  idField: string;
  order: number;
  name: string;
  placeholder: string;
  hint: string;
  type: FormType;
  isRequired: boolean;
  regex: string;
  formatError: string;
  value: string;
  options?: FormOption[];
  relatedIds?: number[];
  relatedValues?: number[];
}

export interface FormSection {
  idField: string;
  order: number;
  name: string;
  description: string;
  fields: FormField[];
}

export interface ApplicationForm {
  idField: string;
  name: string;
  description: string;
  image: string;
  fields: FormSection[];
}

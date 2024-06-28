import { DomainDoc } from '../models/domain';

export interface Response {
  message: string;
  data?: DomainDoc;
}

export enum DomainStatus {
  PENDING = 'pending',
  SCANNING = 'scanning',
  COMPLETED = 'completed',
}

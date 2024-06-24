export interface DomainType {
  domainName: string;
  status: 'pending' | 'completed' | 'failed';
  lastScannedAt: Date;
  data: object;
}

export enum DomainStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

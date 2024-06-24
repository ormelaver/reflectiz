import cronParser from 'cron-parser';

import { IScanner } from '../scanners/baseScanner';
import { scannerFactory } from '../utils/scannerFactory';
import { scannerList } from '../utils/scannerList';
import { ScannerType } from '../types/scanner';
import { Domain, DomainDoc } from '../models/domain';
import { DomainStatus } from '../types/domain';

export class DomainScanner {
  private static instance: DomainScanner;
  private scanners: IScanner[] = [];
  private results: object[] = [];
  private cronScanInterval = process.env.CRON_SCAN_INTERVAL || '*/5 * * * *';

  private constructor() {
    this.scanners = scannerList.map((scanner: ScannerType) =>
      scannerFactory.createScanner(scanner)
    );
  }

  public static getInstance(): DomainScanner {
    if (!DomainScanner.instance) {
      DomainScanner.instance = new DomainScanner();
    }
    return DomainScanner.instance;
  }

  public async scanAllSources(): Promise<void> {
    const domainsToScan = await this.getDomainsToScan();
    // for (let i = 0; i < this.scanners.length; i++) {
    //   const result = await this.scanners[i].scan(domain);
    //   this.results.push(result);
    // }
    //create new scanners with factory
    //scan domains
    //update db (with status=complete)
    console.log('Scanning domains', domainsToScan);
  }

  public async getDomainsToScan(): Promise<DomainDoc[]> {
    const scanInterval = this.getIntervalFromCron(this.cronScanInterval);
    const now = new Date();
    const domainsToScan = Domain.find({
      $or: [
        { status: DomainStatus.PENDING },
        { lastScannedAt: { $lt: new Date(now.getTime() - scanInterval) } },
      ],
    });

    return domainsToScan;
  }

  private getIntervalFromCron(cronExpression: string): number {
    const interval = cronParser.parseExpression(cronExpression);
    const next = interval.next().toDate().getTime();
    const now = new Date().getTime();
    return next - now;
  }
}

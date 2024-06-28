import { ScannerType } from '../types/scanner';
import { BaseScanner } from '../scanners/baseScanner';
import { VirusTotalScanner } from '../scanners/virusTotalScanner';
import { WhoisScanner } from '../scanners/whoisScanner';

class ScannerFactory {
  private scanners: { [key: string]: BaseScanner } = {};

  constructor() {}

  createScanner(type: ScannerType): BaseScanner {
    let scanner: BaseScanner;
    switch (type) {
      case ScannerType.WHOIS:
        scanner = new WhoisScanner();
        this.scanners[type] = scanner;
        break;
      case ScannerType.VIRUSTOTAL:
        scanner = new VirusTotalScanner();
        this.scanners[type] = scanner;
        break;
      default:
        throw new Error('Invalid scanner type');
    }
    return scanner;
  }
}

export const scannerFactory = new ScannerFactory();

import { ScannerType } from '../types/scanner';
import { IScanner } from '../scanners/baseScanner';
import { VirusTotalScanner } from '../scanners/virusTotalScanner';
import { WhoisScanner } from '../scanners/whoisScanner';

class ScannerFactory {
  private scanners: { [key: string]: IScanner } = {};
  private validSources: Set<string> = new Set();

  constructor() {}

  createScanner(type: ScannerType): IScanner {
    let scanner: IScanner;
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

  //   getScanner(name: string): ScannerType | null {
  //     return this.scanners[name] || null;
  //   }

  async scanAll(domain: string): Promise<{ [key: string]: object }> {
    const results: { [key: string]: object } = {};
    for (const [name, scanner] of Object.entries(this.scanners)) {
      results[name] = await scanner.scan(domain);
    }
    return results;
  }
}

export const scannerFactory = new ScannerFactory();

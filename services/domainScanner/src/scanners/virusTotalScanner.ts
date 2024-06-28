import { BaseScanner } from './baseScanner';
import { ScannerType } from '../types/scanner';

export class VirusTotalScanner extends BaseScanner {
  public async scan(domainName: string): Promise<string> {
    const scanResult = await super.scan(domainName);
    return this.getFinalResult(scanResult);
  }

  private getFinalResult(scanResult: string): string {
    const scanResultJson = JSON.parse(scanResult);
    scanResultJson['scannerType'] = ScannerType.VIRUSTOTAL;
    const finalResult = JSON.stringify(scanResultJson);
    return finalResult;
  }

  protected get address(): string {
    return 'https://www.virustotal.com/api/v3/domains/';
  }

  protected get headers(): object {
    if (!process.env.VIRUSTOTAL_API_KEY) {
      throw new Error('VIRUSTOTAL_API_KEY must be defined');
    }
    return { headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY } };
  }
}

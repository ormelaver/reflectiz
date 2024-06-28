import { BaseScanner } from './baseScanner';
import { ScannerType } from '../types/scanner';

export class WhoisScanner extends BaseScanner {
  public async scan(domainName: string): Promise<string> {
    const scanResult = await super.scan(domainName);

    return this.getFinalResult(scanResult);
  }

  private getFinalResult(scanResult: string): string {
    const scanResultJson = JSON.parse(scanResult);
    const scannerType = ScannerType.WHOIS;
    const finalObject = { scannerType, ...scanResultJson };
    const finalResult = JSON.stringify(finalObject);
    return finalResult;
  }

  protected get address(): string {
    return 'https://api.api-ninjas.com/v1/whois?domain=';
  }

  protected get headers(): object {
    if (!process.env.WHOIS_API_KEY) {
      throw new Error('WHOIS_API_KEY must be defined');
    }

    return { headers: { 'X-Api-Key': process.env.WHOIS_API_KEY } };
  }
}

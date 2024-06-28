import axios from 'axios';

export abstract class BaseScanner {
  protected abstract get address(): string;
  protected abstract get headers(): object;

  public async scan(domain: string): Promise<string> {
    const { address, headers } = this;
    const res = await axios.get(`${address}${domain}`, headers);
    return JSON.stringify(res.data);
  }
}

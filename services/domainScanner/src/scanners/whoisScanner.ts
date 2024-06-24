import axios from 'axios';

export class WhoisScanner {
  constructor() {}
  public async scan(domain: string): Promise<object> {
    const res = await axios.get(
      `https://www.virustotal.com/api/v3/domains/${domain}`,
      {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY,
        },
      }
    );
    console.log(res.data);
    return { whois: res.data };
  }
}

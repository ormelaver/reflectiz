import { Domain, DomainDoc } from '../models/domain';
import { DomainStatus, Response } from '../types/domain';

class DomainManagerService {
  constructor() {}

  async addDomain(domainName: string): Promise<Response> {
    try {
      const existingDomain = await Domain.findOne({ domainName });
      if (existingDomain) {
        throw new Error('Domain already exists');
      }

      const domainObject = {
        domainName,
        status: DomainStatus.PENDING,
        scanDate: new Date(),
        data: {},
      };
      const newDomain = await Domain.build(domainObject);
      await newDomain.save();
      return { message: 'Domain added for scanning', data: newDomain };
    } catch (error) {
      throw error;
    }
  }

  async getDomainInfo(domainName: string): Promise<Response> {
    try {
      const response = await Domain.findOne({ domainName });
      if (!response) {
        await this.addDomain(domainName);
        return { message: 'Domain not found - added for scanning' };
      } else {
        const status = response.status;
        if (status === DomainStatus.PENDING) {
          return { message: 'Domain is pending scan. Please try again later' };
        }
        if (status === DomainStatus.SCANNING) {
          return {
            message:
              'Domain is currently being scanned. Please try again in a few minutes',
          };
        } else {
          return {
            message: 'Domain info found',
            data: response,
          };
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new DomainManagerService();

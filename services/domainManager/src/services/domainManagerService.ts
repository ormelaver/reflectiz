import { Domain, DomainDoc } from '../models/domain';
import { DomainStatus } from '../types/domain';

class DomainManagerService {
  //singleton?

  constructor() {}

  // public static async init() {
  //   const mongo = await Mongo.getInstance();
  //   return new DomainManagerService(mongo);
  // }

  async addDomain(domainName: string): Promise<DomainDoc> {
    try {
      const existingDomain = await Domain.findOne({ domainName });
      if (existingDomain) {
        throw new Error('Domain already exists');
      }

      const domainObject = {
        domainName,
        status: DomainStatus.PENDING,
        lastScannedAt: new Date(),
        data: {},
      };
      const newDomain = await Domain.build(domainObject);
      await newDomain.save();
      return newDomain;
    } catch (error) {
      throw error;
    }
  }

  async getDomainInfo(domainName: string): Promise<DomainDoc | boolean> {
    try {
      const existingDomain = await Domain.findOne({ domainName });
      if (!existingDomain) {
        await this.addDomain(domainName);
        return false;
      } else {
        return existingDomain;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new DomainManagerService();

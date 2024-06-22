import { Domain, DomainDoc } from '../models/domain';
import { DomainStatus } from '../types/domain';

class DomainManagerService {
  //singleton?

  constructor() {}

  // public static async init() {
  //   const mongo = await Mongo.getInstance();
  //   return new DomainManagerService(mongo);
  // }

  async addDomain(domain: string): Promise<DomainDoc> {
    try {
      // const existingDomain = await this.mongoHandle.getDomain(domain);
      // if (existingDomain) {
      //   throw new Error('Domain already exists');
      // }

      const domainObject = {
        domainName: domain,
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
    // return newDomain.toObject();

    // const newDomain = Domain.build(domain);

    // await newDomain.save();
    // return newDomain;
  }

  // async getDomainById(id: string): Promise<DomainType | null> {
  //   // TODO: Implement domain retrieval logic
  // }
}

export default new DomainManagerService();

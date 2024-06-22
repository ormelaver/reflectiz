import mongoose from 'mongoose';

import {
  Domain,
  DomainAttrs,
  DomainDoc,
} from '../services/domainManager/src/models/domain';

export class Mongo {
  private static instance: Mongo | null = null;
  private connection: any;
  private isConnected: boolean = false;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static async getInstance(): Promise<Mongo> {
    if (!Mongo.instance) {
      Mongo.instance = new Mongo();
      await Mongo.instance.init();
    }
    return Mongo.instance;
  }

  public async addDomain(domain: DomainAttrs): Promise<DomainDoc> {
    // const existingDomain = await Domain.findOne({ domain: domainName });
    // if (existingDomain) {
    //   throw new Error('Domain already exists');
    // }
    const newDomain = Domain.build(domain);
    await newDomain.save();
    return newDomain;
  }

  private async init() {
    let database;

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }
    try {
      await mongoose.connect(process.env.MONGO_URI);
      await Domain.init();
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

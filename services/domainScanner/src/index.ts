import 'dotenv/config';
import cron from 'node-cron';
import mongoose from 'mongoose';

import { DomainScanner } from './services/domainScanner';

const timePeriod = process.env.TIME_PERIOD || '*/5 * * * *';

const startScanner = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }
    await mongoose.connect(process.env.MONGO_URI);
    await scheduleTask(timePeriod);
  } catch (error: any) {
    throw error;
  }
};

const scheduleTask = async (cronTime: string) => {
  const scanner = DomainScanner.getInstance();
  cron.schedule(cronTime, async () => {
    try {
      console.log('Starting scan...');
      await scanner.scanAllSources();
      console.log('Scan completed.');
    } catch (error) {
      console.error('Error during scan:', error);
    }
  });
};

startScanner();
console.log(`Scanner started! Running every ${timePeriod}`);

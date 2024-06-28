import 'dotenv/config';
import cron from 'node-cron';
import mongoose from 'mongoose';
import { AmqpClient } from './utils/amqpClient';

import { DomainScanner } from './services/domainScanner';

const timePeriod = process.env.CRON_SCAN_INTERVAL || '*/5 * * * *';

const scheduleTask = async (cronTime: string) => {
  const scanner = DomainScanner.getInstance(new Date());
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

const startScanner = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.AMQP_URI) {
      throw new Error('AMQP_URI must be defined');
    }

    if (!process.env.AMQP_QUEUE_NAME) {
      throw new Error('AMQP_QUEUE_NAME must be defined');
    }

    if (!process.env.CRON_SCAN_INTERVAL) {
      throw new Error('CRON_SCAN_INTERVAL must be defined');
    }
    const amqpClient = AmqpClient.getInstance();
    await amqpClient.connect(process.env.AMQP_URI);
    await amqpClient.createChannel();
    await amqpClient.createQueue(process.env.AMQP_QUEUE_NAME);
    await mongoose.connect(process.env.MONGO_URI);
    await scheduleTask(timePeriod);
  } catch (error: any) {
    throw error;
  }
};

startScanner();
console.log(`Scanner started! Running every ${timePeriod}`);

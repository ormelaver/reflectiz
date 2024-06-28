import cronParser from 'cron-parser';

import { BaseScanner } from '../scanners/baseScanner';
import { scannerFactory } from '../utils/scannerFactory';
import { scannerList } from '../utils/scannerList';
import { ScannerType } from '../types/scanner';
import { Domain, History, DomainDoc, DomainAttrs } from '../models/domain';
import { DomainStatus } from '../types/domain';
import { AmqpClient } from '../utils/amqpClient';

export class DomainScanner {
  private static instance: DomainScanner;
  private scanners: BaseScanner[] = [];
  private amqpClient = AmqpClient.getInstance();
  private queueName = process.env.AMQP_QUEUE_NAME || 'results';
  private cronScanInterval = process.env.CRON_SCAN_INTERVAL || '*/5 * * * *';

  private constructor(creationDate: Date) {
    this.scanners = scannerList.map((scanner: ScannerType) =>
      scannerFactory.createScanner(scanner)
    );
  }

  public static getInstance(creationDate: Date): DomainScanner {
    if (!DomainScanner.instance) {
      DomainScanner.instance = new DomainScanner(creationDate);
    }
    return DomainScanner.instance;
  }

  public async scanAllSources(): Promise<void> {
    const domainsToScan = await this.getDomainsToScan();
    await this.updateDomainStatus(domainsToScan, DomainStatus.SCANNING);
    for (const domainDoc of domainsToScan) {
      const domainName = domainDoc.domainName;
      let messageToSend: Record<string, any> = { [domainName]: {} };
      for (const scanner of this.scanners) {
        try {
          const result = await scanner.scan(domainName);
          const resultObject = JSON.parse(result);
          messageToSend[domainName][resultObject.scannerType] = resultObject;
        } catch (error) {
          console.error(`Error scanning domain ${domainName}:`, error);
        }
      }
      messageToSend.isFirstScan = domainDoc.status === DomainStatus.PENDING;
      messageToSend.domainName = domainName;

      await this.amqpClient.sendToQueue(
        this.queueName,
        JSON.stringify(messageToSend)
      );
    }

    await this.saveResults();
  }

  private async saveResults(): Promise<any> {
    this.amqpClient.consumeMsg(this.queueName, async (msg) => {
      if (msg !== null) {
        try {
          const messageContent = JSON.parse(msg.content.toString());
          const domainName = messageContent.domainName;
          const isFirstScan = messageContent.isFirstScan;
          const data = messageContent[domainName];

          const filter = { domainName };
          const scanDate =
            new Date().getTime() -
            parseInt(process.env.SCAN_BUFFER_MILLISECONDS!);
          const updateDoc = {
            $set: {
              status: DomainStatus.COMPLETED,
              scanDate: new Date(scanDate),
              data,
            },
          };

          if (isFirstScan) {
            await Domain.updateOne(filter, updateDoc);
          } else {
            const prevDomainDoc = await Domain.findOneAndUpdate(
              filter,
              updateDoc,
              {
                projection: { _id: 0, __v: 0 },
              }
            );
            if (prevDomainDoc !== null) {
              const historyDoc = await History.build(
                prevDomainDoc as DomainAttrs
              );
              historyDoc.isNew = true;
              await historyDoc.save();
            }
          }
          await this.amqpClient.ackMsg(msg);
        } catch (error) {
          throw error;
        }
      }
    });
  }

  private async getDomainsToScan(): Promise<DomainDoc[]> {
    const scanInterval = this.getIntervalFromCron(this.cronScanInterval);
    const now = new Date();

    const domainsToScan = await Domain.find({
      $or: [
        { status: DomainStatus.PENDING },
        { scanDate: { $lt: new Date(now.getTime() - scanInterval) } },
      ],
    });

    return domainsToScan;
  }

  private async updateDomainStatus(
    domainsToScan: DomainDoc[],
    status: DomainStatus
  ): Promise<void> {
    const domainIdsToUpdate = domainsToScan.map((domain) => domain._id);
    await Domain.updateMany(
      { _id: { $in: domainIdsToUpdate } },
      { $set: { status } }
    );
  }

  private getIntervalFromCron(cronExpression: string): number {
    try {
      const interval = cronParser.parseExpression(cronExpression);
      const firstDate = interval.next().toDate();
      const secondDate = interval.next().toDate();
      const diff = secondDate.getTime() - firstDate.getTime();
      return diff;
    } catch (err) {
      console.error('Error parsing cron expression:', err);
      return 0;
    }
  }
}

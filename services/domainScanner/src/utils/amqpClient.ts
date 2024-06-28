import amqp from 'amqplib';

export class AmqpClient {
  private static instance: AmqpClient;
  private maxRetries = 3;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  private constructor() {}

  public static getInstance(): AmqpClient {
    if (!AmqpClient.instance) {
      AmqpClient.instance = new AmqpClient();
    }
    return AmqpClient.instance;
  }

  public async connect(uri: string): Promise<void> {
    if (!this.connection) {
      let retries = this.maxRetries;
      while (retries > 0) {
        try {
          this.connection = await amqp.connect(uri);
          console.log('Connected to AMQP successfully.');
          break; // Exit loop on success
        } catch (error: any) {
          retries--;
          console.error(
            `Error connecting to AMQP, retrying... ${retries} retries left.`,
            error
          );
          if (retries === 0) {
            console.error('Error connecting to AMQP, retries maxed out.');
            throw error; // Rethrow the last error after exhausting retries
          }
          await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 1 second before retrying
        }
      }
    }
  }

  public async sendToQueue(queueName: string, msg: any): Promise<void> {
    try {
      await this.channel!.sendToQueue(queueName, Buffer.from(msg), {
        persistent: true,
      });
    } catch (error: any) {
      throw error;
    }
  }

  public consumeMsg(
    queueName: string,
    callback: (msg: amqp.Message) => void
  ): void {
    if (!this.channel) {
      throw new Error('Channel not established');
    }
    this.channel.consume(
      queueName,
      (msg) => {
        if (msg) {
          callback(msg);
        }
      },
      { noAck: false }
    );
  }

  public async createQueue(queueName: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not established');
    }
    await this.channel.assertQueue(queueName, { durable: true });
  }

  public async getQueueSize(queueName: string): Promise<number> {
    const queueData = await this.channel!.checkQueue(queueName);
    console.log('QQQQQQQQQQQQQQQ DATA', queueData);
    return queueData.messageCount;
  }
  public async ackMsg(msg: amqp.Message): Promise<void> {
    await this.channel!.ack(msg);
  }
  public async createChannel(): Promise<amqp.Channel> {
    if (!this.connection) {
      throw new Error('Connection not established');
    }
    this.channel = await this.connection.createChannel();
    return this.connection.createChannel();
  }
}

import 'dotenv/config';
import mongoose from 'mongoose';

import { app } from './app';
import { Domain } from './models/domain';

const PORT = process.env.PORT;

// const cleanup = async () => {
//   const redisClient = RedisClient.getInstance();
//   await redisClient.shutdown();
//   console.log('Disconnected from Redis');
// };

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }

    await mongoose.connect(process.env.MONGO_URI);
    await Domain.init();
    app.listen(3000, () => {
      console.log('Database indexed!');
      console.log('server listening on port ' + PORT);
    });
  } catch (error: any) {
    throw error;
  }
};

start();

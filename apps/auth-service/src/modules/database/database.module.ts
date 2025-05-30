import { Module } from '@nestjs/common';
import { createConnection } from 'mongoose';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        return await createConnection(
          process.env.MONGO_URI || 'mongodb://localhost:27017/auth-db',
        );
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}

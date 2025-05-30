import { Module } from '@nestjs/common';
import { User, UserModel } from '../../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: getModelToken(User.name),
      useFactory: (connection: Connection) =>
        connection.model(User.name, UserModel.schema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class AuthModule {}

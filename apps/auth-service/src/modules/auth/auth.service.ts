import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(
    data: RegisterDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const createdUser = await this.userModel.create({
      ...data,
      password: hashedPassword,
    });
    const { password, ...userWithoutPassword } = createdUser.toObject();

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }
}

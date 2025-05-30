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
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RabbitPublisherService } from 'src/rabbitmq/publisher.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private publisher: RabbitPublisherService,
  ) {}

  async register(
    data: RegisterDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    // Check for email uniqueness
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // create user
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const createdUser = await this.userModel.create({
      ...data,
      password: hashedPassword,
    });
    const { password, ...userWithoutPassword } = createdUser.toObject();

    await this.publisher.publish('user.created', {
      id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
    });

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    return {
      message: 'User Login successfully',
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(token: string) {
    try {
      if (!token) throw new Error();
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'supersecret',
      });
      const payload = {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      return {
        message: 'Token refreshed',
        accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async me(reqUser: any) {
    const user = await this.userModel
      .findOne({ email: reqUser.email })
      .select('-password');
    return user;
  }

  async validate(payload: any) {
    const token = payload.Authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');

    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}

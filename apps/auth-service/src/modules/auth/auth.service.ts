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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
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
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../../schemas/user.schema';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const isExist = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (isExist) {
      throw new BadRequestException('Email already exists');
    }

    const user = new this.userModel(registerDto);

    await user.save();

    return {
      message: 'User created successfully',
      data: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({
        email: loginDto.email,
      })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      sub: user._id,
      role: user.role,
      email: user.email,
    });

    return { message: 'Login successful', token };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      updateProfileDto,
      {
        new: true,
      },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Profile updated successfully',
      user,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).select('+password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = changePasswordDto.newPassword;

    await user.save();

    return {
      message: 'Password changed successfully',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.isOTPVerified = false;

    await user.save();

    // TODO: Send email here
    console.log('OTP:', otp);

    return {
      message: 'OTP sent successfully',
    };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    const user = await this.userModel.findOne({
      email: verifyOtpDto.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      !user.otp ||
      user.otp !== verifyOtpDto.otp ||
      !user.otpExpires ||
      user.otpExpires.getTime() < Date.now()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isOTPVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return {
      message: 'OTP verified successfully',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel
      .findOne({
        email: resetPasswordDto.email,
      })
      .select('+password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isOTPVerified) {
      throw new BadRequestException('OTP not verified');
    }

    user.password = resetPasswordDto.password;

    user.isOTPVerified = false;

    await user.save();

    return {
      message: 'Password reset successfully',
    };
  }
}

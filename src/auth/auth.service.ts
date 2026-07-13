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
import { generateOTP } from '../utils/otp.util';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = new this.userModel(registerDto);

      await user.save();

      return {
        message: 'User created successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new BadRequestException('Email already exists');
      }

      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({
        email: loginDto.email,
      })
      .select('+password name email role tokenVersion');

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
      tokenVersion: user.tokenVersion,
    });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password -otp -otpExpires -isOTPVerified');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.name) {
      user.name = updateProfileDto.name;
    }

    if (updateProfileDto.phone) {
      user.phone = updateProfileDto.phone;
    }

    if (updateProfileDto.profileImage) {
      user.profileImage = updateProfileDto.profileImage;
    }

    try {
      await user.save();
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        const mongoError = error as any;

        if (mongoError.code === 11000 && mongoError.keyPattern?.email) {
          throw new BadRequestException('Email already exists');
        }
      }

      throw error;
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

    const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException('New password cannot be the same as current password' );
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

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.isOTPVerified = false;

    await user.save();

    await this.mailService.sendOTPEmail(user.email, otp);
    // console.log('OTP:', otp);

    return {
      message: 'OTP sent successfully',
    };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    const user = await this.userModel
      .findOne({
        email: verifyOtpDto.email,
      })
      .select('+otp otpExpires isOTPVerified');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isExpired = !user.otpExpires || user.otpExpires.getTime() < Date.now();

    if (!user.otp || user.otp !== verifyOtpDto.otp || isExpired) {

      user.otp = undefined;
      user.otpExpires = undefined;

      await user.save();

      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isOTPVerified = true;

    // remove OTP after successful verification
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
      .select('+password tokenVersion isOTPVerified');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isOTPVerified) {
      throw new BadRequestException('OTP not verified');
    }

    user.password = resetPasswordDto.password;

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOTPVerified = false;

    await user.save();

    return {
      message: 'Password reset successfully',
    };
  }
}

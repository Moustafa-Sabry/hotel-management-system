import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop()
  phone?: string;

  @Prop()
  profileImage?: string;

  @Prop({
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @Prop({
    default: true,
  })
  isActive: boolean;
  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;

  @Prop({
    default: false,
  })
  isOTPVerified: boolean;

  @Prop({
    default: 0,
  })
  tokenVersion: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 8);
});
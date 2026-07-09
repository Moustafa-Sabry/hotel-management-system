import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  async sendOTPEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,

      subject: 'Hotel Management - Password Reset OTP',

      html: `
        <h2>Password Reset Request</h2>

        <p>Your OTP code is:</p>

        <h1>${otp}</h1>

        <p>
          This code expires in 10 minutes.
        </p>

        <p>
          If you did not request this, ignore this email.
        </p>
      `,
    });
  }
}

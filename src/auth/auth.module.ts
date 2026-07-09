import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User, UserSchema } from '../../schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'hotel-management-secret',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy, RolesGuard],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}

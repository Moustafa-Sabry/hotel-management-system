import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { OfferModule } from './offer/offer.module';
import { ReviewModule } from './review/review.module';
import { FavouriteModule } from './favourite/favourite.module';
import { FacilityModule } from './facility/facility.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [DatabaseModule, UserModule, RoomModule, BookingModule, OfferModule, ReviewModule, FavouriteModule, FacilityModule, AuthModule,AuthModule, DashboardModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

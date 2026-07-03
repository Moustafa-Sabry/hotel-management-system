import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from 'schemas/offer.schema';
import { CreateOfferDto } from './dto/create.offers.dto';
import { GetOffersDto } from './dto/get.offers.dto';
import { UpdateOfferDto } from './dto/update.offers.dto';


@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name)
    private readonly offerModel: Model<OfferDocument>,
  ) {}

  async addOffer(body: CreateOfferDto) {
    const offer = await this.offerModel.create(body);

    return {
      message: 'Offer created successfully',
      data: offer,
    };
  }

  async getAllOffers(query: GetOffersDto) {
    const { page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const offers = await this.offerModel
      .find(filter)
      .skip(skip)
      .limit(limit);

    const total = await this.offerModel.countDocuments(filter);

    return {
      message: 'Offers fetched successfully',
      page,
      limit,
      total,
      data: offers,
    };
  }

  async getOneOffer(id: string) {
    const offer = await this.offerModel.findById(id);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return {
      message: 'Offer fetched successfully',
      data: offer,
    };
  }

  async updateOffer(id: string, body: UpdateOfferDto) {
    const offer = await this.offerModel.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return {
      message: 'Offer updated successfully',
      data: offer,
    };
  }

  async deleteOffer(id: string) {
    const offer = await this.offerModel.findByIdAndDelete(id);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return {
      message: 'Offer deleted successfully',
      data: offer,
    };
  }
}
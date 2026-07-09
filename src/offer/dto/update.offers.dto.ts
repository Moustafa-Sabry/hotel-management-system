import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create.offers.dto';


export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
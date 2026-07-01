import { Controller } from '@nestjs/common';
import { FacilityService } from './facility.service';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}
}

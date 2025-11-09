import { Controller } from '@nestjs/common';
import { DealService } from '../services/deal.service';

@Controller('deal')
export class DealController {
  constructor(private readonly dealService: DealService) {}
}

import { Controller } from '@nestjs/common';
import { ResourceService } from '../services/resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}
}

import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
// import { Request, Response } from 'express';
import { ClientsDTO } from '../clients.dto';
// import { ActivitiesSKU } from './activities.sku';

@Controller({ path: 'clients', version: 'v1' })
@ApiTags('clients')
export class ClientsControllerV1 {
  constructor(private clientsService: ClientsService) {}

  @Post('/check-eligibility')
  checkEligibility(@Body() body: ClientsDTO) {
    return this.clientsService.validateRules(body);
  }
}

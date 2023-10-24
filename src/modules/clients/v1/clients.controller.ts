import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientsDTO } from '../clients.dto';

@Controller({ path: 'clients', version: '1' })
@ApiTags('clients')
export class ClientsControllerV1 {
  constructor(private clientsService: ClientsService) {}

  @Get('/')
  find() {
    return this.clientsService.helloWorld();
  }

  @Post('/')
  checkEligibility(@Body() body: ClientsDTO) {
    return this.clientsService.validateRules(body);
  }
}

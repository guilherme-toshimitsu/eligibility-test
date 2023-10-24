import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientsDTO } from '../clients.dto';

@Controller({ path: 'clients', version: '1' })
@ApiTags('clients')
export class ClientsControllerV1 {
  constructor(private clientsService: ClientsService) {}

  @Get('/')
  helloWorld() {
    return this.clientsService.helloWorld();
  }

  @Post('/check-eligibility')
  @HttpCode(200)
  checkEligibility(@Body() body: ClientsDTO) {
    return this.clientsService.validateRules(body);
  }
}

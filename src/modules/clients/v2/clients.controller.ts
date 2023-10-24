import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsServiceV2 } from './clients.service';

@Controller({ path: 'clients', version: '2' })
@ApiTags('clients')
export class ClientsControllerV2 {
  constructor(private clientsService: ClientsServiceV2) {}

  @Get('/')
  helloWorld() {
    return this.clientsService.helloWorld();
  }
}

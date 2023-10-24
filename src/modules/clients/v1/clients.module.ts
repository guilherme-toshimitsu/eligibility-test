import { Module } from '@nestjs/common';
import { ClientsControllerV1 } from './clients.controller';
import { ClientsService } from './clients.service';

@Module({
  controllers: [ClientsControllerV1],
  providers: [ClientsService],
})
export class ClientsModuleV1 {}

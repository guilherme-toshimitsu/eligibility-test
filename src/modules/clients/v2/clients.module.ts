import { Module } from '@nestjs/common';
import { ClientsControllerV2 } from './clients.controller';
import { ClientsServiceV2 } from './clients.service';

@Module({
  controllers: [ClientsControllerV2],
  providers: [ClientsServiceV2],
})
export class ClientsModuleV2 {}

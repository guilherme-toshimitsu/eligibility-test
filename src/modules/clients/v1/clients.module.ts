import { Module, Logger } from '@nestjs/common';
import { ClientsControllerV1 } from './clients.controller';
import { ClientsService } from './clients.service';

@Module({
  controllers: [ClientsControllerV1],
  providers: [ClientsService, Logger],
})
export class ClientsModuleV1 {}

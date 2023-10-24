import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClientsModuleV1 } from './modules/clients/v1/clients.module';
import { ClientsModuleV2 } from './modules/clients/v2/clients.module';

import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './src/config/config.env',
    }),
    ClientsModuleV1,
    ClientsModuleV2,
    HealthModule,
  ],
})
export class AppModule {}

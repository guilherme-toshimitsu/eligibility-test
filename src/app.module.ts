import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClientsModuleV1 } from './modules/clients/v1/clients.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './src/config/config.env',
    }),
    ClientsModuleV1,
    HealthModule,
  ],
})
export class AppModule {}

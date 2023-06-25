import { Module } from '@nestjs/common';
import { DatabaseModule } from 'infra/database/database.module';

export const ApplicationContainerInject = Object.freeze({
  ImplListEstablishmentCommand: {},
});

@Module({
  imports: [DatabaseModule],
  providers: [],
  exports: [],
})
export class ApplicationModule {}

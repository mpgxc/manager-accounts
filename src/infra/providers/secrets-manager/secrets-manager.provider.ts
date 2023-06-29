import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  SecretsManagerOutput,
  SecretsManagerPackage,
  SecretsManagerProvider,
  SecretsManagerService,
  SecretsManagerkey,
} from './secrets-manager.interface';

@Injectable()
class ImplSecretsManagerProvider
  implements SecretsManagerProvider, OnModuleInit
{
  private secretsService!: SecretsManagerProvider;

  constructor(@Inject(SecretsManagerPackage) private client: ClientGrpc) {}

  onModuleInit() {
    this.secretsService = this.client.getService<SecretsManagerProvider>(
      SecretsManagerService,
    );
  }

  get({ key }: SecretsManagerkey): Observable<SecretsManagerOutput> {
    return this.secretsService.get({ key });
  }
}

export { ImplSecretsManagerProvider };

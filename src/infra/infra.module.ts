import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ApplicationErrorMapper } from 'commons/errors';
import { InfraHttpModule } from './http/http.module';
import { ImplHasherProvider } from './providers/hasher/hasher.provider';
import { LoggerService } from './providers/logger/logger.service';

const InfraContainerInject = [
  ApplicationErrorMapper,
  ImplHasherProvider,
  LoggerService,
];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraHttpModule,
    PassportModule,
    JwtModule.register({
      global: true,
      publicKey:
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAttKlBRZpgMaEt443asxE\nLN8EI1NKPdV11KFiDwvA/HIcxreYTzVOI85pnEiVtziOKbZxEXB6Qgo0mG9QeoCu\nzbcBrOsiRXr8FLnj6/nguDljCSsNb0OURR0uMxhqo459rdmSZWcKSZsx2uvMka7L\nDxXnY9i5WprbequRkJK6eGNqtK/6UtNA9mP5awECjdn/fupzhJUUtZKm6ehIA6He\n6J0Qd9RKJt5tF+/JyZg5aEq5Cr2trPE8S7IEli3I0laLFAnSVakb71+/2KdjXP8/\naBcqKoz9StqwGGg3YwtMImTkZOUzX7/zwBPGHT2OQIIDuVAjnGupRhtFcwAxScw6\nyQIDAQAB\n-----END PUBLIC KEY-----',
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC20qUFFmmAxoS3\njjdqzEQs3wQjU0o91XXUoWIPC8D8chzGt5hPNU4jzmmcSJW3OI4ptnERcHpCCjSY\nb1B6gK7NtwGs6yJFevwUuePr+eC4OWMJKw1vQ5RFHS4zGGqjjn2t2ZJlZwpJmzHa\n68yRrssPFedj2Llamtt6q5GQkrp4Y2q0r/pS00D2Y/lrAQKN2f9+6nOElRS1kqbp\n6EgDod7onRB31Eom3m0X78nJmDloSrkKva2s8TxLsgSWLcjSVosUCdJVqRvvX7/Y\np2Nc/z9oFyoqjP1K2rAYaDdjC0wiZORk5TNfv/PAE8YdPY5AggO5UCOca6lGG0Vz\nADFJzDrJAgMBAAECggEADWWpPxKx34RspFDRIcvfMRSUpowLdDWIwXCkEWswlK8+\nCZfZmvBSjhApsBCnm/oSfN8IMRl3dBBwYz1A/gEhDiUbg9LlO4c0Isaue5PfklBu\nP/U+MkmW+2uUf50J73tZHVzEvBaNa/Bp+ltuLbzL14qo3qm6h3eynq4k6B3AeWLb\nuPrpKud5wJhq3zD4rDkmU/+Otq4n6mJ95JTetVA2ShFzh7KSPZNMZ4kPqrhvUCgS\n44xOZwCiYD38cRJR/AR2HU3NaTMlN988XLcj98cM0r8zeAbyqnLR8Ulc6X0X4piM\nmAdCr24tBkjYNfo1K//QBsLSh7ZPXrMWetBh6Q7AMwKBgQDzac6FD/5bGxsjmuRW\nhRK7Eb6o66805clO1slpLSmi1yd6nb+iMUWbO7ZeP3Yzb7XaJyXV+coORyP445iY\nlY2DrIgCBocQbY3yby9WmPvirGWmRAtQO9eZwmDpDFnn3aV52opb0+W+xv2lLlkc\n0blqOjyQHQTRRaYxfnyu+P5nxwKBgQDARsTg3kNWs2BRbDnIup1/6Fb1JionUaTQ\nnw9zH8Th8LCyLQTNDV6BKhsGbjjWGQYkf+a8ymtB6Eia+tnldVhp88IrMeslA00c\nworbYec8+VA4mBk2pVWjAPaViUDDg/i8d4u2OFtJ7Jff6O0tYI1E5YLc2CMq/4AF\nzsfcidvo7wKBgQDLxbfuDQWSn46IsBKXm6+ii6hhIWz7i6KLLaRPOE+y0wtpysWy\nsizjV4nEPLxnMw26Iyu5hfNxIH0sztvgYNKneLgjefN3/T7nxcyLYmb7y/cMycnu\n0Socvm0CrCRXx2XQLPPHDA05OLz+m15ekfP2yeoJe0GdMAGBTbJziF7x4QKBgGYs\ntS5xrgMCqypZgpNiZ5Oy2ZLIRxpBzn12KPWaajtOdfcY6TY15oRo5ZeTNuy+u37l\n4K1uO3T4hKympOfEZclX2VSu4C/5Ax9HWhaefgzux2xrluptDYbjWiW4nAvJs4Ij\nXMDmTcyIx2QbGP5GEowMEnBdAsM0pslvStGtCIlNAoGAaJi+zA4PlbBcrSP83rm1\n6x1K3h1873A8QvkOVgw1hk/5utU0UAqXDbBLFbZFt9QhIRC8P0Qa7GMQFWjPWG8g\nI6jJKWVTi6kjuNX8G9I7kGiLkIoGU+hEB2LuMdaAX16lr0O/aedo8sYc+m66oQQl\nYEATLbqTI2upLcLTFxDV7/U=\n-----END PRIVATE KEY-----',
      signOptions: {
        expiresIn: '300s',
        algorithm: 'RS256',
      },
    }),
    ClientsModule.register([
      {
        name: SecretsManagerPackage,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:5000', //TODO: Adicionar ao environment
          package: 'secrets',
          protoPath: path.join(__dirname, './grpc/secrets-manager.proto'),
        },
      },
    ]),
  ],
  providers: InfraContainerInject,
  exports: InfraContainerInject,
})
export class InfraModule {}

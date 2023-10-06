import { Injectable } from '@nestjs/common';
import { MailingInput, MailingProvider } from './mailing.interface';

@Injectable()
export class ImplMailingProvider implements MailingProvider {
  async sendMail({ body, subject, to }: MailingInput): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

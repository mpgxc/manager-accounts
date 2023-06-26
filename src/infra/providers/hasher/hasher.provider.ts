import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { HasherProvider } from './hasher.interface';

@Injectable()
class ImplHasherProvider implements HasherProvider {
  public readonly saltOrRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltOrRounds);
  }

  async isMatch(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export { ImplHasherProvider };

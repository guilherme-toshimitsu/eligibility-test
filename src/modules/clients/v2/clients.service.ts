import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsServiceV2 {
  constructor() {}

  helloWorld() {
    return 'Hello World V2';
  }
}

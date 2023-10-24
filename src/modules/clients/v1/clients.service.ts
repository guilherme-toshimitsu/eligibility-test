import { Injectable } from '@nestjs/common';
import { ClientsDTO } from '../clients.dto';

@Injectable()
export class ClientsService {
  constructor() {}

  validateRules(body: ClientsDTO) {
    return body;
  }
}

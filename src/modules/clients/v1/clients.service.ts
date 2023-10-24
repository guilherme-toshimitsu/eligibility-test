import { Injectable } from '@nestjs/common';
import {
  ClientsDTO,
  ClassesDeConsumoValida,
  ModalidadesTarifariasValidas,
  TiposDeConexao,
} from '../clients.dto';

import { ERRORS } from '../errors/client.errors';

@Injectable()
export class ClientsService {
  constructor() {}

  validateRules(body: ClientsDTO) {
    const totalConsumption = body.historicoDeConsumo.reduce(
      (sum, value) => sum + value,
      0,
    );
    const avgConsumption = totalConsumption / body.historicoDeConsumo.length;

    const errors = [];

    errors.push(this.checkInvalidConsumerClass(body.classeDeConsumo));
    errors.push(this.checkInvalidTaxTypes(body.modalidadeTarifaria));
    errors.push(
      this.checkInvalidConsumption(body.tipoDeConexao, avgConsumption),
    );

    const arrOfErrors = errors.filter((val) => val);

    if (arrOfErrors.length) {
      return {
        elegivel: false,
        razoesDeInelegibilidade: arrOfErrors,
      };
    } else {
      return {
        elegivel: true,
        economiaAnualDeCO2:
          this.calculateCO2ConsumptionSavings(totalConsumption),
      };
    }
  }

  checkInvalidConsumerClass(consumerClass: string) {
    if (consumerClass in ClassesDeConsumoValida) {
      return false;
    } else {
      return ERRORS.INVALID_CONSUMER_CLASS;
    }
  }

  checkInvalidTaxTypes(taxType: string) {
    if (taxType in ModalidadesTarifariasValidas) {
      return false;
    } else {
      return ERRORS.INVALID_TAX_TYPE;
    }
  }

  checkInvalidConsumption(tipoDeConexao: string, avgConsumption: number) {
    if (tipoDeConexao === TiposDeConexao.monofasico && avgConsumption >= 400) {
      return false;
    }
    if (tipoDeConexao === TiposDeConexao.bifasico && avgConsumption >= 500) {
      return false;
    }
    if (tipoDeConexao === TiposDeConexao.trifasico && avgConsumption >= 750) {
      return false;
    }

    return ERRORS.INVALID_CONSUMPTION;
  }

  calculateCO2ConsumptionSavings(totalAnualConsumption: number) {
    return (totalAnualConsumption * 84) / 1000;
  }

  helloWorld() {
    return 'Hello World V1';
  }
}

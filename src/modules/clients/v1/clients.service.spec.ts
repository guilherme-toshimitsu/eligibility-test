import { ClientsService } from './clients.service';
import { ClientsControllerV1 } from './clients.controller';
import { ERRORS } from '../errors/client.errors';
import { TiposDeConexao } from '../clients.dto';

describe('ClientService', () => {
  let clientService: ClientsService;
  let clientsController: ClientsControllerV1;

  beforeEach(() => {
    clientService = new ClientsService();
    clientsController = new ClientsControllerV1(clientService);
  });

  describe('validateRules', () => {
    it('should be called', async () => {
      const validBody = {
        numeroDoDocumento: '41018631801234',
        tipoDeConexao: 'bifasico',
        classeDeConsumo: 'comercial',
        modalidadeTarifaria: 'convencional',
        historicoDeConsumo: [
          3878, // mes atual
          9760, // mes anterior
          5976, // 2 meses atras
          2797, // 3 meses atras
          2481, // 4 meses atras
          5731, // 5 meses atras
          7538, // 6 meses atras
          4392, // 7 meses atras
          7859, // 8 meses atras
          4160, // 9 meses atras
          6941, // 10 meses atras
          4597, // 11 meses atras
        ],
      };
      const result = { elegivel: true, economiaAnualDeCO2: 5553.24 };

      jest
        .spyOn(clientService, 'validateRules')
        .mockImplementation(() => result);

      expect(await clientsController.checkEligibility(validBody)).toBe(result);
    });
  });

  describe('checkInvalidConsumerClass function', () => {
    it('Valid Consumer Class residencial', async () => {
      expect(clientService.checkInvalidConsumerClass('residencial')).toBe(
        false,
      );
    });

    it('Valid Consumer Class rural', async () => {
      expect(clientService.checkInvalidConsumerClass('industrial')).toBe(false);
    });

    it('Valid Consumer Class rural', async () => {
      expect(clientService.checkInvalidConsumerClass('comercial')).toBe(false);
    });

    it('Invalid Consumer Class non existant in enum', async () => {
      expect(clientService.checkInvalidConsumerClass('bla')).toBe(
        ERRORS.INVALID_CONSUMER_CLASS,
      );
    });

    it('Invalid Consumer Class rural', async () => {
      expect(clientService.checkInvalidConsumerClass('poderPublico')).toBe(
        ERRORS.INVALID_CONSUMER_CLASS,
      );
    });

    it('Invalid Consumer Class poderPublico', async () => {
      expect(clientService.checkInvalidConsumerClass('poderPublico')).toBe(
        ERRORS.INVALID_CONSUMER_CLASS,
      );
    });
  });

  describe('checkInvalidTaxTypes function', () => {
    it('Valid Tax Type branca', async () => {
      expect(clientService.checkInvalidTaxTypes('branca')).toBe(false);
    });

    it('Valid Tax Type convencional', async () => {
      expect(clientService.checkInvalidTaxTypes('convencional')).toBe(false);
    });

    it('Invalid Tax Type non existant in enum', async () => {
      expect(clientService.checkInvalidTaxTypes('bla')).toBe(
        ERRORS.INVALID_TAX_TYPE,
      );
    });

    it('Invalid Tax Type verde', async () => {
      expect(clientService.checkInvalidTaxTypes('verde')).toBe(
        ERRORS.INVALID_TAX_TYPE,
      );
    });

    it('Invalid Tax Type azul', async () => {
      expect(clientService.checkInvalidTaxTypes('azul')).toBe(
        ERRORS.INVALID_TAX_TYPE,
      );
    });
  });

  describe('checkInvalidConsumption function', () => {
    it('Valid Consumption monofasico 400', async () => {
      expect(
        clientService.checkInvalidConsumption(TiposDeConexao.monofasico, 400),
      ).toBe(false);
    });

    it('Valid Consumption bifasico 500', async () => {
      expect(
        clientService.checkInvalidConsumption(TiposDeConexao.bifasico, 500),
      ).toBe(false);
    });

    it('Valid Consumption trifasico 750', async () => {
      expect(
        clientService.checkInvalidConsumption(TiposDeConexao.trifasico, 750),
      ).toBe(false);
    });

    it('Invalid Consumption monofasico 400', async () => {
      expect(
        clientService.checkInvalidConsumption(TiposDeConexao.monofasico, 399),
      ).toBe(ERRORS.INVALID_CONSUMPTION);
    });

    it('Invalid Consumption bifasico 500', async () => {
      expect(
        clientService.checkInvalidConsumption(TiposDeConexao.bifasico, 499),
      ).toBe(ERRORS.INVALID_CONSUMPTION);
    });

    it('Invalid Consumption trifasico 750', async () => {
      expect(
        clientService.checkInvalidConsumption(TiposDeConexao.trifasico, 749),
      ).toBe(ERRORS.INVALID_CONSUMPTION);
    });
  });
});

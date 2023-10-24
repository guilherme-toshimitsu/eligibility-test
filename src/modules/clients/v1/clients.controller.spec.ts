import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';

describe('ClientsControllerV1 E2E Testing', () => {
  let app;
  const baseUrl = '/v1/clients';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    app.enableVersioning({
      type: VersioningType.URI,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Hello World', () => {
    it('should return Hello World', async () => {
      return request(app.getHttpServer())
        .get(baseUrl)
        .expect(200)
        .expect('Hello World V1');
    });
  });

  describe('Elegibility', () => {
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

    it('should return valid response', async () => {
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(validBody)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(true);
          expect(response.body.economiaAnualDeCO2).toBe(5553.24);
        });
    });

    it('should return valid response taxtype: Branca e consumerclass: industrial', async () => {
      const body = {
        ...validBody,
        classeDeConsumo: 'industrial',
        modalidadeTarifaria: 'branca',
      };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(true);
          expect(response.body.economiaAnualDeCO2).toBe(5553.24);
        });
    });

    it('should return valid response consumerclass: residencial', async () => {
      const body = {
        ...validBody,
        classeDeConsumo: 'residencial',
        modalidadeTarifaria: 'branca',
      };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(true);
          expect(response.body.economiaAnualDeCO2).toBe(5553.24);
        });
    });
  });

  describe('Inegibility', () => {
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

    it('invalid due to consumerClass rural', async () => {
      const body = { ...validBody, classeDeConsumo: 'rural' };
      const error = ['Classe de consumo não aceita'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('invalid due to consumerClass poderPublico', async () => {
      const body = { ...validBody, classeDeConsumo: 'poderPublico' };
      const error = ['Classe de consumo não aceita'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('invalid due to modalidadeTarifaria verde', async () => {
      const body = { ...validBody, modalidadeTarifaria: 'verde' };
      const error = ['Modalidade tarifária não aceita'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('invalid due to modalidadeTarifaria azul', async () => {
      const body = { ...validBody, modalidadeTarifaria: 'azul' };
      const error = ['Modalidade tarifária não aceita'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('consumo baixo geral', async () => {
      const body = {
        ...validBody,
        historicoDeConsumo: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      };
      const error = ['Consumo muito baixo para tipo de conexão'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('consumo baixo para faixa monofasico', async () => {
      const body = {
        ...validBody,
        tipoDeConexao: 'monofasico',
        historicoDeConsumo: Array(12).fill(399),
      };
      const error = ['Consumo muito baixo para tipo de conexão'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('consumo baixo para faixa bifasico', async () => {
      const body = {
        ...validBody,
        tipoDeConexao: 'bifasico',
        historicoDeConsumo: Array(12).fill(499),
      };
      const error = ['Consumo muito baixo para tipo de conexão'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('consumo baixo para faixa trifasico', async () => {
      const body = {
        ...validBody,
        tipoDeConexao: 'trifasico',
        historicoDeConsumo: Array(12).fill(700),
      };
      const error = ['Consumo muito baixo para tipo de conexão'];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('Mix Error 1', async () => {
      const body = {
        ...validBody,
        tipoDeConexao: 'trifasico',
        classeDeConsumo: 'rural',
        historicoDeConsumo: Array(12).fill(700),
      };
      const error = [
        'Consumo muito baixo para tipo de conexão',
        'Classe de consumo não aceita',
      ];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('Mix Error 2', async () => {
      const body = {
        ...validBody,
        tipoDeConexao: 'trifasico',
        modalidadeTarifaria: 'azul',
        historicoDeConsumo: Array(12).fill(700),
      };
      const error = [
        'Consumo muito baixo para tipo de conexão',
        'Modalidade tarifária não aceita',
      ];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });

    it('Mix Error 3', async () => {
      const body = {
        ...validBody,
        tipoDeConexao: 'trifasico',
        modalidadeTarifaria: 'azul',
        classeDeConsumo: 'rural',

        historicoDeConsumo: Array(12).fill(700),
      };
      const error = [
        'Consumo muito baixo para tipo de conexão',
        'Modalidade tarifária não aceita',
        'Classe de consumo não aceita',
      ];
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.elegivel).toBe(false);
          expect(response.body.razoesDeInelegibilidade).toEqual(
            expect.arrayContaining(error),
          );
        });
    });
  });

  describe('invalid Request', () => {
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

    it('invalid doc number', async () => {
      const body = { ...validBody, numeroDoDocumento: '' };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toBe(
            'numeroDoDocumento must match ^(\\d{11}|\\d{14})$ regular expression',
          );
        });
    });

    it('empty doc number', async () => {
      const body = { ...validBody };
      delete body.numeroDoDocumento;
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toBe(
            'numeroDoDocumento must match ^(\\d{11}|\\d{14})$ regular expression',
          );
          expect(response.body.message[1]).toBe(
            'numeroDoDocumento must be a string',
          );
        });
    });

    it('invalid typeConnection', async () => {
      const body = { ...validBody, tipoDeConexao: 'bla' };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'tipoDeConexao must be one of the following values: monofasico, bifasico, trifasico',
          );
        });
    });

    it('empty typeConnection', async () => {
      const body = { ...validBody };
      delete body.tipoDeConexao;

      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'tipoDeConexao must be one of the following values: monofasico, bifasico, trifasico',
          );
        });
    });

    it('invalid classeDeConsumo', async () => {
      const body = { ...validBody, classeDeConsumo: 'bla' };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'classeDeConsumo must be one of the following values: residencial, industrial, comercial, rural, poderPublico',
          );
        });
    });

    it('empty classeDeConsumo', async () => {
      const body = { ...validBody };
      delete body.classeDeConsumo;

      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'classeDeConsumo must be one of the following values: residencial, industrial, comercial, rural, poderPublico',
          );
        });
    });

    it('invalid modalidadeTarifaria', async () => {
      const body = { ...validBody, modalidadeTarifaria: 'bla' };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'modalidadeTarifaria must be one of the following values: azul, branca, verde, convencional',
          );
        });
    });

    it('empty classeDeConsumo', async () => {
      const body = { ...validBody };
      delete body.modalidadeTarifaria;

      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'modalidadeTarifaria must be one of the following values: azul, branca, verde, convencional',
          );
        });
    });

    it('invalid historicoDeConsumo', async () => {
      const body = { ...validBody, historicoDeConsumo: 'bla' };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'historicoDeConsumo must be an array',
          );
        });
    });

    it('empty classeDeConsumo', async () => {
      const body = { ...validBody };
      delete body.historicoDeConsumo;

      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'historicoDeConsumo must be an array',
          );
        });
    });

    it('invalid historicoDeConsumo less than 3 elements', async () => {
      const body = { ...validBody, historicoDeConsumo: [1] };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'historicoDeConsumo must contain at least 3 elements',
          );
        });
    });

    it('invalid historicoDeConsumo more than 12 elements', async () => {
      const body = {
        ...validBody,
        historicoDeConsumo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'historicoDeConsumo must contain no more than 12 elements',
          );
        });
    });

    it('invalid historicoDeConsumo invalid values less than 0', async () => {
      const body = {
        ...validBody,
        historicoDeConsumo: [-1, 1, 1, 1, 1],
      };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'each value in historicoDeConsumo must not be less than 0',
          );
        });
    });

    it('invalid historicoDeConsumo invalid values more than 9999', async () => {
      const body = {
        ...validBody,
        historicoDeConsumo: [10000, 1, 1, 1, 1],
      };
      return request(app.getHttpServer())
        .post(baseUrl)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message[0]).toContain(
            'each value in historicoDeConsumo must not be greater than 9999',
          );
        });
    });
  });
});

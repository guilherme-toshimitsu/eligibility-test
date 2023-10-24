import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';

describe('ClientsControllerV1 E2E Testing', () => {
  let app;
  const baseUrl = '/v2/clients';

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
        .expect('Hello World V2');
    });
  });
});

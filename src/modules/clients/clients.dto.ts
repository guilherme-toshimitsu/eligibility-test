import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Matches, ValidateNested } from 'class-validator';

export class CPFDTO {
  @ApiProperty()
  @IsString()
  @Matches('^\\d{11}$')
  cpf: string;
}

export class CNPJDTO {
  @ApiProperty()
  @IsString()
  @Matches('^\\d{14}$')
  cnpj: string;
}

export class ClientsDTO {
  //One Of CPF or CNPJ Required
  @ApiProperty({
    oneOf: [
      {
        type: 'object',
        required: ['cpf'],
        properties: {
          cpf: {
            type: 'string',
          },
        },
      },
      {
        type: 'object',
        required: ['cnpj'],
        properties: {
          cnpj: {
            type: 'string',
          },
        },
      },
    ],
  })
  @ValidateNested()
  @Type((type) => (type.object.cpfOrCnpj.cpf ? CPFDTO : CNPJDTO))
  cpfOrCnpj: CPFDTO | CNPJDTO;

  @ApiProperty({ enum: ['monofasico', 'bifasico', 'trifasico'] })
  tiposDeConexao: string;

  @ApiProperty({
    enum: ['residencial', 'industrial', 'comercial', 'rural', 'poderPublico'],
  })
  classesDeConsumo: string;

  @ApiProperty({
    enum: ['azul', 'branca', 'verde', 'convencional'],
  })
  modalidadesTarifarias: string;
}

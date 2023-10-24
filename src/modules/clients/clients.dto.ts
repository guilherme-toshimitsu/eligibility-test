import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  Max,
  Min,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';

export enum TiposDeConexao {
  monofasico = 'monofasico',
  bifasico = 'bifasico',
  trifasico = 'trifasico',
}

export enum ClassesDeConsumo {
  residencial = 'residencial',
  industrial = 'industrial',
  comercial = 'comercial',
  rural = 'rural',
  poderPublico = 'poderPublico',
}

export enum ModalidadesTarifarias {
  azul = 'azul',
  branca = 'branca',
  verde = 'verde',
  convencional = 'convencional',
}

export enum ClassesDeConsumoValida {
  residencial = 'residencial',
  industrial = 'industrial',
  comercial = 'comercial',
}

export enum ModalidadesTarifariasValidas {
  branca = 'branca',
  convencional = 'convencional',
}

export class ClientsDTO {
  //One Of CPF or CNPJ Required
  //TODO: Merge a correct CPF and CNPJ regex or do CPF/CNPJ Validation in Controller
  @ApiProperty({
    description: 'CPF or CNPJ, 11 or 14 digits',
    default: '11111111111',
  })
  @IsString()
  @Matches('^(\\d{11}|\\d{14})$')
  public numeroDoDocumento: string;

  @ApiProperty({ enum: ['monofasico', 'bifasico', 'trifasico'] })
  @IsEnum(TiposDeConexao)
  public tipoDeConexao: string;

  @ApiProperty({
    enum: ['residencial', 'industrial', 'comercial', 'rural', 'poderPublico'],
  })
  @IsEnum(ClassesDeConsumo)
  public classeDeConsumo: string;

  @ApiProperty({
    enum: ['azul', 'branca', 'verde', 'convencional'],
    default: 'branca',
  })
  @IsEnum(ModalidadesTarifarias)
  public modalidadeTarifaria: string;

  @ApiProperty({
    type: [Number],
    minimum: 0,
    maximum: 9999,
    maxLength: 12,
    minLength: 3,
    default: [3878, 9760, 5976, 2797, 2481],
  })
  @Min(0, { each: true })
  @Max(9999, { each: true })
  @ArrayMaxSize(12)
  @ArrayMinSize(3)
  @IsArray()
  public historicoDeConsumo: number[];
}

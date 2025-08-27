import { ApiProperty } from '@nestjs/swagger';

export class BadRequestErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;
}

export class ConflictErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'email in use',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Conflict',
  })
  error: string;
}

export class InternalServerErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Internal server error',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Internal Server Error',
  })
  error: string;
}

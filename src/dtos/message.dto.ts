import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({
    description: 'The message to be sent',
    example: 'Hello, world!',
  })
  @Expose()
  message: string;
}

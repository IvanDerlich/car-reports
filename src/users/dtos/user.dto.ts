import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Whether the user has admin privileges',
    example: false,
  })
  @Expose()
  admin: boolean;
}

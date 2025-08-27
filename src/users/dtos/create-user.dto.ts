import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (will be hashed with Argon2)',
    example: 'securepassword123',
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Whether the user should have admin privileges',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  admin?: boolean;
}

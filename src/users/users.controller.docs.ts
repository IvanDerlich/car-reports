import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { MessageDto } from '@/dtos/message.dto';

export function CreateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user account',
      description:
        'Registers a new user with email and password. Creates a session and returns user data.',
    }),
    ApiBody({
      type: CreateUserDto,
      description: 'User registration data',
      examples: {
        regularUser: {
          summary: 'Regular User Signup',
          description: 'Create a new regular user account',
          value: {
            email: 'user@example.com',
            password: 'securepassword123',
          },
        },
        adminUser: {
          summary: 'Admin User Signup',
          description: 'Create a new admin user account',
          value: {
            email: 'admin@example.com',
            password: 'adminpassword123',
            admin: true,
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'User successfully created and logged in',
      type: UserDto,
    }),
  );
}

export function SigninDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Sign in an existing user',
      description: 'Logs in a user with email and password. Creates a session.',
    }),
    ApiBody({
      type: CreateUserDto,
      description: 'User login data',
      examples: {
        regularUser: {
          summary: 'Regular User Signin',
          description: 'Login a regular user account',
          value: {
            email: 'user@example.com',
            password: 'securepassword123',
          },
        },
        adminUser: {
          summary: 'Admin User Signin',
          description: 'Login an admin user account',
          value: {
            email: 'admin@example.com',
            password: 'adminpassword123',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      type: UserDto,
    }),
  );
}

export function WhoAmIDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current user information',
      description: 'Returns the details of the authenticated user.',
    }),
    ApiResponse({
      status: 200,
      description: 'User information retrieved successfully',
      type: UserDto,
    }),
  );
}

export function SignOutDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Sign out the current user',
      description: 'Logs out the current user by clearing the session.',
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully signed out',
      type: MessageDto,
    }),
  );
}

export function FindUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find user by ID',
      description: 'Retrieves a user by their unique identifier.',
    }),
    ApiResponse({
      status: 200,
      description: 'User found successfully',
      type: UserDto,
    }),
  );
}

export function FindAllUsersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find users by email',
      description: 'Retrieves all users matching the provided email.',
    }),
    ApiResponse({
      status: 200,
      description: 'Users found successfully',
      type: [UserDto],
    }),
  );
}

export function RemoveUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remove user',
      description: 'Deletes a user by their unique identifier.',
    }),
    ApiResponse({
      status: 200,
      description: 'User removed successfully',
      type: UserDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Cannot delete user - user has associated reports',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example:
              'Cannot delete user. User has 3 report(s) associated with their account. Please delete all reports before deleting the user.',
          },
        },
      },
    }),
  );
}

export function UpdateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user',
      description: 'Updates a user by their unique identifier.',
    }),
    ApiBody({
      type: CreateUserDto,
      description: 'User update data',
    }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      type: UserDto,
    }),
  );
}

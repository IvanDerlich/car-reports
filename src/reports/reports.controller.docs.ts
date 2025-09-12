import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { GetEstimateReturnValueDto } from './dtos/get-estimate-return-value.dto';

export function CreateReportDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new car report',
      description:
        'Creates a new car report with details like make, model, year, price, and location.',
    }),
    ApiBody({
      type: CreateReportDto,
      description: 'Car report data',
      examples: {
        sampleReport: {
          summary: 'Sample Car Report',
          description: 'Example of a car report submission',
          value: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            mileage: 50000,
            lng: -122.4194,
            lat: 37.7749,
            price: 25000,
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Report successfully created',
      type: ReportDto,
    }),
  );
}

export function SetApprovalDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Approve or reject a car report',
      description: 'Admin-only endpoint to approve or reject a car report.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          approved: {
            type: 'boolean',
            description: 'Whether to approve or reject the report',
            example: true,
          },
        },
        required: ['approved'],
      },
      examples: {
        approveReport: {
          summary: 'Approve Report',
          description: 'Approve a car report',
          value: {
            approved: true,
          },
        },
        rejectReport: {
          summary: 'Reject Report',
          description: 'Reject a car report',
          value: {
            approved: false,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Report approval status updated successfully',
      type: ReportDto,
    }),
  );
}

export function GetAllReportsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all car reports',
      description: 'Retrieves all car reports in the system.',
    }),
    ApiResponse({
      status: 200,
      description: 'All reports retrieved successfully',
      type: [ReportDto],
    }),
  );
}

export function GetReportByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a specific car report',
      description: 'Retrieves a specific car report by its unique identifier.',
    }),
    ApiResponse({
      status: 200,
      description: 'Report retrieved successfully',
      type: ReportDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Report not found',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Report not found',
          },
        },
      },
    }),
  );
}

export function GetEstimateDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get price estimate for a car',
      description:
        'Retrieves a price estimate based on car make, model, year, mileage, and location.',
    }),
    ApiQuery({
      name: 'make',
      description: 'Car manufacturer (e.g., Toyota, Honda)',
      example: 'Ford',
    }),
    ApiQuery({
      name: 'model',
      description: 'Car model (e.g., Camry, Accord)',
      example: 'Mustang',
    }),
    ApiQuery({
      name: 'year',
      description: 'Manufacturing year',
      example: 2020,
    }),
    ApiQuery({
      name: 'mileage',
      description: 'Car mileage in miles',
      example: 10000,
    }),
    ApiQuery({
      name: 'lng',
      description: 'Longitude coordinate',
      example: 10,
    }),
    ApiQuery({
      name: 'lat',
      description: 'Latitude coordinate',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Price estimate retrieved successfully',
      type: GetEstimateReturnValueDto,
    }),
  );
}

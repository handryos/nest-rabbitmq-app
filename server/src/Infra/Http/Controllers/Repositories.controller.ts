import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  InternalServerErrorException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { AddRepository } from 'src/Application/UseCases/Repos/Add/AddRepository.usecase';
import { PaginationDto } from 'src/@shared/@pagination';
import { GetManyRepositories } from 'src/Application/UseCases/Repos/GetAll/GetManyRepositories.usecase';
import { GetRepositorieById } from 'src/Application/UseCases/Repos/GetBy/GetBy.usecase';
import { UpdateRepository } from 'src/Application/UseCases/Repos/Update/UpdateRepository';
import { DeleteRepository } from 'src/Application/UseCases/Repos/Remove/RemoveRepository.usecase';
import { AuthenticatedRequest } from 'src/@shared/@guards/authenticated-request.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly add: AddRepository,
    private readonly getAll: GetManyRepositories,
    private readonly getBy: GetRepositorieById,
    private readonly update: UpdateRepository,
    private readonly remove: DeleteRepository,
  ) {}

  @Post()
  @UseGuards(AuthenticatedRequest)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new repository' })
  @ApiBody({
    description: 'Data to create a new repository',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'nestjs' },
          owner: { type: 'string', example: 'nestjs-team' },
          stars: { type: 'number', example: 1500 },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Repository created successfully.' })
  @ApiResponse({ status: 500, description: 'Error adding the repository.' })
  async addRepository(@Body() repository: RepositoryDTO[]): Promise<any> {
    try {
      await this.add.execute(repository);
      return { message: 'Repository created successfully' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error adding the repository',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @UseGuards(AuthenticatedRequest)
  @ApiOperation({ summary: 'Get a repository by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Repository ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Repository retrieved successfully.',
  })
  @ApiResponse({ status: 500, description: 'Error retrieving the repository.' })
  async getRepositoryById(@Param('id') id: number): Promise<any> {
    try {
      const repo = await this.getBy.execute(id);
      return { message: 'Repository retrieved successfully', repo };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error retrieving the repository',
        error: error.message,
      });
    }
  }

  @Get()
  @UseGuards(AuthenticatedRequest)
  @ApiOperation({ summary: 'Get a list of repositories with pagination' })
  @ApiBody({
    description: 'Pagination parameters',
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        order: { type: 'string', enum: ['ASC', 'DESC'], example: 'ASC' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Repositories retrieved successfully.',
  })
  @ApiResponse({ status: 500, description: 'Error retrieving repositories.' })
  async getManyRepositories(@Body() pagination: PaginationDto): Promise<any> {
    try {
      const repos = await this.getAll.execute(pagination);
      return {
        message: 'Repositories retrieved successfully',
        repositories: repos,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error retrieving paginated repositories',
        error: error.message,
      });
    }
  }
  @Put(':id')
  @UseGuards(AuthenticatedRequest)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a repository by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Repository ID to update',
    example: 1,
  })
  @ApiBody({
    description: 'Data to update an existing repository',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'nestjs' },
        owner: { type: 'string', example: 'nestjs-team' },
        stars: { type: 'number', example: 1800 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Repository updated successfully.' })
  @ApiResponse({ status: 404, description: 'Repository not found.' })
  @ApiResponse({ status: 500, description: 'Error updating the repository.' })
  async updateRepository(
    @Param('id') id: number,
    @Body() repository: RepositoryDTO,
  ): Promise<any> {
    try {
      await this.update.execute(repository, id);
      return { message: 'Repository updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error updating the repository',
        error: error.message,
      });
    }
  }

  @Delete(':name')
  @UseGuards(AuthenticatedRequest)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a repository by name' })
  @ApiParam({
    name: 'name',
    type: 'string',
    description: 'Name of the repository to delete',
    example: 'nestjs',
  })
  @ApiResponse({ status: 200, description: 'Repository deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Repository not found.' })
  @ApiResponse({ status: 500, description: 'Error deleting the repository.' })
  async deleteRepository(@Param('name') name: string): Promise<any> {
    try {
      await this.remove.execute(name);
      return { message: 'Repository deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error deleting the repository',
        error: error.message,
      });
    }
  }
}

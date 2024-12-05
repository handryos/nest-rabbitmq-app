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
import { GetRepositorieByName } from 'src/Application/UseCases/Repos/GetBy/GetBy.usecase';
import { UpdateRepository } from 'src/Application/UseCases/Repos/Update/UpdateRepository';
import { DeleteRepository } from 'src/Application/UseCases/Repos/Remove/RemoveRepository.usecase';

@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly add: AddRepository,
    private readonly getAll: GetManyRepositories,
    private readonly getBy: GetRepositorieByName,
    private readonly update: UpdateRepository,
    private readonly remove: DeleteRepository,
  ) {}

  @Post()
  // @UseGuards(AuthenticatedRequest)
  @HttpCode(HttpStatus.CREATED)
  async addRepository(@Body() repository: RepositoryDTO): Promise<any> {
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

  @Get(':name')
  // @UseGuards(AuthenticatedRequest)
  async getRepositoryByName(@Param('name') name: string): Promise<any> {
    try {
      const repo = await this.getBy.execute(name);
      return { message: 'Repository retrieved successfully', data: repo };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error retrieving the repository',
        error,
      });
    }
  }

  @Get()
  // @UseGuards(AuthenticatedRequest)
  async getManyRepositories(@Query() pagination: PaginationDto): Promise<any> {
    try {
      const repos = await this.getAll.execute(pagination);
      return { message: 'Repositories retrieved successfully', data: repos };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error retrieving paginated repositories',
        error,
      });
    }
  }

  @Put(':id')
  // @UseGuards(AuthenticatedRequest)
  @HttpCode(HttpStatus.OK)
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
  // @UseGuards(AuthenticatedRequest)
  @HttpCode(HttpStatus.OK)
  async deleteRepository(@Param('name') name: string): Promise<any> {
    try {
      await this.remove.execute(name);
      return { message: 'Repository deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error deleting the repository',
        error,
      });
    }
  }
}

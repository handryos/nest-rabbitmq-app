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
} from '@nestjs/common';
import { RepositoryDTO } from 'src/@shared/@dtos';
import { AuthenticatedRequest } from 'src/@shared/@guards/authenticated-request.guard';
import { PaginationDto } from 'src/@shared/@pagination';
import { AddRepository } from 'src/Application/UseCases/Repos/Add/AddRepository.usecase';
import { GetManyRepositories } from 'src/Application/UseCases/Repos/GetAll/GetManyRepositories.usecase';
import { GetRepositorieByName } from 'src/Application/UseCases/Repos/GetBy/GetBy.usecase';
import { DeleteRepository } from 'src/Application/UseCases/Repos/Remove/RemoveRepository.usecase';
import { UpdateRepository } from 'src/Application/UseCases/Repos/Update/UpdateRepository';

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
  // @UseGuards(AuthenticatedRequest) lembrar de voltar os guards
  async addRepository(@Body() repository: RepositoryDTO): Promise<void> {
    try {
      await this.add.execute(repository);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error adding the repository',
        error,
      });
    }
  }

  @Get(':name')
  // @UseGuards(AuthenticatedRequest)
  async getRepositoryByName(@Param('name') name: string) {
    try {
      return await this.getBy.execute(name);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error retrieving the repository',
        error,
      });
    }
  }

  @Get()
  // @UseGuards(AuthenticatedRequest)
  async getManyRepositories(@Query() pagination: PaginationDto) {
    try {
      return await this.getAll.execute(pagination);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error retrieving paginated repositories',
        error,
      });
    }
  }

  @Put(':id')
  // @UseGuards(AuthenticatedRequest)
  async updateRepository(
    @Param('id') id: number,
    @Body() repository: RepositoryDTO,
  ) {
    try {
      await this.update.execute(repository, id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error updating the repository',
        error,
      });
    }
  }

  @Delete(':name')
  // @UseGuards(AuthenticatedRequest)
  async deleteRepository(@Param('name') name: string) {
    try {
      await this.remove.execute(name);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error deleting the repository',
        error,
      });
    }
  }
}

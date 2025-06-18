import { Injectable } from '@nestjs/common';
import { CodeCategoryRepository } from './code-category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeCategory } from './code-category.entity';

@Injectable()
export class CodeCategoryService {
  constructor(
    @InjectRepository(CodeCategoryRepository)
    private codeCategoryRepository: CodeCategoryRepository,
  ) {}

  async getAll(): Promise<CodeCategory[]> {
    return await this.codeCategoryRepository.find();
  }

  async findById(id: string): Promise<CodeCategory | null> {
    return await this.codeCategoryRepository.findOne({ where: { id } });
  }
}

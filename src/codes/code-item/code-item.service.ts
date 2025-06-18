import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeItemRepository } from './code-item.repository';
import { CodeItem } from './code-item.entity';

@Injectable()
export class CodeItemService {
  constructor(
    @InjectRepository(CodeItemRepository)
    private codeItemRepository: CodeItemRepository,
  ) {}

  async getAll(): Promise<CodeItem[]> {
    return await this.codeItemRepository.find();
  }

  async findById(id: string): Promise<CodeItem | null> {
    return await this.codeItemRepository.findOne({ where: { id } });
  }
}

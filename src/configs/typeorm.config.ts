import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeORMConfig: TypeOrmModuleOptions = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'mysql',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  //[__dirname + '/../**/*.entity.{js,ts}'],
  timezone: 'Z',
  port: 3306,
  database: 'keeping',
  username: 'root',
  password: 'root',
  host: 'localhost',
};

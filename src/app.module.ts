import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FeedModule } from './feed/feed.module';
import { FileModule } from './file/file.module';
import { CodeCategoryModule } from './codes/code-category/code-category.module';
import { CodesModule } from './codes/codes.module';
import { AuthModule } from './auth/auth.module';
import { MagazineModule } from './magazine/magazine.module';
import { AdminModule } from './admin/admin.module';
import { TopicModule } from './topic/topic.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/config/.env`,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    FeedModule,
    FileModule,
    CodeCategoryModule,
    CodesModule,
    AuthModule,
    MagazineModule,
    TopicModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

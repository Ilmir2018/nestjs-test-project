import { Module } from '@nestjs/common';
import { UsersService } from './services/user-service/users.service';
import { UsersController } from './controller/users.controller';
import { UserHelperService } from './services/user-helper/user-helper.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UserHelperService],
  exports: [UsersService],
})
export class UsersModule {}

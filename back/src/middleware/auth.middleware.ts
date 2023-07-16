import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/services/auth.service';
import { UserI } from 'src/users/models/interfaces/user.interface';
import { UsersService } from 'src/users/services/user-service/users.service';

export interface RequestModel extends Request {
  user: UserI;
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      const user: UserI = await this.userService.findOne(decodedToken.user.id);
      if (user) {
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}

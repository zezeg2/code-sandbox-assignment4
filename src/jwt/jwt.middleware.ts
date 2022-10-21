import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    @Inject() private readonly jwtService: JwtService,
    @Inject() private readonly userService: UserService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token);
      try {
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.userService.findById(decoded['id']);
          req['user'] = user;
        }
      } catch (error) {}
    }
    next();
  }
}

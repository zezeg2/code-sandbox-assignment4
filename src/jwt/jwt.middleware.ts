import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserService } from '../user/user.service';

@Injectable()
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void): Promise<any> {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token);
      try {
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.usersService.findById(decoded['id']);
          req['user'] = user;
        }
      } catch (error) {}
    }
    next();
  }
}

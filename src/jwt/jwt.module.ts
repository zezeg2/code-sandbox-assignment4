import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOptions } from './jwt.interface';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Module({
  providers: [JwtService],
})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}

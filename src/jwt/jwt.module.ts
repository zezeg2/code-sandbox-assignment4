import { DynamicModule, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CONFIG_OPTION } from '../common/common.constants';
import { JwtModuleOptions } from './jwt.interface';

@Module({
  providers: [JwtService],
})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [
        {
          provide: CONFIG_OPTION,
          useValue: options,
        },
      ],
    };
  }
}

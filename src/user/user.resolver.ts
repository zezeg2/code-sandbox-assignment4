import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonOutput } from '../common/common.output.dto';
import {
  CreateUserInput,
  LoginInput,
  LoginOutput,
  UpdateUserInput,
  UserProfileOutput,
} from './user.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.entity';
import { AuthUser } from '../auth/auth.auth-user.decorator';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  /**
   * - createAccount
   * - login
   * - editProfile
   * - seeProfile
   */

  constructor(private readonly userService: UserService) {}

  @Mutation(() => CommonOutput)
  async createAccount(
    @Args('input') input: CreateUserInput,
  ): Promise<CommonOutput> {
    return this.userService.createAccount(input);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    return this.userService.login(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CommonOutput)
  async editProfile(
    @Args('input') input: UpdateUserInput,
    @AuthUser() authUser: User,
  ): Promise<CommonOutput> {
    return this.userService.editProfile(authUser.id, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => UserProfileOutput)
  async seeProfile(@Args('id') id: number): Promise<UserProfileOutput> {
    return this.userService.seeProfile(id);
  }
}

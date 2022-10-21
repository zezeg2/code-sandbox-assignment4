import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonOutput } from '../common/common.output.dto';
import {
  CreateUserInput,
  LoginInput,
  LoginOutput,
  UpdateUserInput,
  UserProfileOutput,
} from './user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.entity';
import { AuthUser } from '../auth/auth.auth-user.decorator';

@Resolver()
export class UserResolver {
  /**
   * - createAccount
   * - login
   * - editProfile
   * - seeProfile
   */

  @Mutation(() => CommonOutput)
  async createAccount(
    @Args('input') input: CreateUserInput,
  ): Promise<CommonOutput> {}

  @Mutation(() => LoginInput)
  async login(@Args('input') input: LoginInput): Promise<LoginOutput> {}

  @UseGuards(AuthGuard)
  @Mutation(() => CommonOutput)
  async editProfile(
    @Args('input') input: UpdateUserInput,
    @AuthUser() authUser: User,
  ): Promise<CommonOutput> {}

  @UseGuards(AuthGuard)
  @Query(() => UserProfileOutput)
  async seeProfile(@Args('id') id: number): Promise<UserProfileOutput> {}
}

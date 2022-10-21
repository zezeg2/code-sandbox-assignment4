import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CommonOutput } from '../common/common.output.dto';
import { User, UserRole } from './user.entity';
import { BaseEntity } from '../common/common.base_entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CommonOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}

@ObjectType()
export class Profile extends BaseEntity {
  @Field(() => String)
  email: string;

  @Field(() => UserRole)
  role: UserRole;
}

@ObjectType()
export class UserProfileOutput extends CommonOutput {
  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}

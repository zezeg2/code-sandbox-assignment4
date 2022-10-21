import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseEntity } from '../common/common.base_entity';

export enum UserRole {
  Listener,
  Host,
}

registerEnumType(UserRole, { name: 'userRole ' });
@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  private _id: string;

  @Column({ select: false })
  @Field(() => String)
  private _email;

  @Column({ select: false })
  @Field(() => String)
  private _password;

  @Column({ default: 0 })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  private _role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this._password) {
      try {
        this._password = await bcrypt.hash(this._password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(inputPwd: string): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPwd, this._password);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  get password() {
    return this._password;
  }

  set password(value) {
    this._password = value;
  }

  get role(): UserRole {
    return this._role;
  }

  set role(value: UserRole) {
    this._role = value;
  }
}

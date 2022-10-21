import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonOutput } from '../common/common.output.dto';
import {
  CreateUserInput,
  LoginInput,
  LoginOutput,
  UpdateUserInput,
  UserProfileOutput,
} from './user.dto';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createAccount(input: CreateUserInput): Promise<CommonOutput> {
    const { email, password, role } = input;
    try {
      if (await this.userRepository.findOne({ where: { email } })) {
        return {
          isOK: false,
          error: 'There is a user with that email already',
        };
      }
      await this.userRepository.save(
        this.userRepository.create({ email, password, role }),
      );
      return { isOK: true };
    } catch (e) {
      return { isOK: false, error: "Couldn't create account" };
    }
  }
  async login(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;
    const user = await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { email },
    });
    if (!user) return { isOK: false, error: 'Not Found User' };
    if (!(await user.checkPassword(password)))
      return { isOK: false, error: 'Wrong Password' };
    const token = this.jwtService.sign(user.id);
    return { isOK: true, token };
  }
  catch(error) {
    return { isOK: false, error };
  }

  async editProfile(id: number, input: UpdateUserInput): Promise<CommonOutput> {
    const { email, password } = input;
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
      });
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      await this.userRepository.save(user);
      return { isOK: true };
    } catch (error) {
      console.log(error);
      return { isOK: false, error: 'Not Found User' };
    }
  }
  async seeProfile(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.findById(id);
      if (!user) throw Error('Not Found User');
      return {
        isOK: Boolean(user),
        profile: user,
      };
    } catch (error) {
      return {
        isOK: false,
        error: error.message,
      };
    }
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async find(id: number) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (user) {
      return user;
    }
    throw new NotFoundException('No user found with the id : ' + id);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findByUsername(userName: string) {
    return await this.userRepo.findOne({ where: { email: userName } });
  }

  async create(creatUser: CreateUserDto) {
    try {
      const user = this.userRepo.create(creatUser);
      return await this.userRepo.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new ConflictException(
          'User with name ' + creatUser.name + ' already exists',
        );
      }
      throw error;
    }
  }

  async update(id: number, updateUser: UpdateUserDto) {
    return await this.userRepo.update(id, updateUser);
  }
}

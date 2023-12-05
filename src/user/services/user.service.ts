import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async find(id: number) {
    return await this.userRepo.findOne({ where: { id: id } });
  }

  async findByUsername(userName: string) {
    return await this.userRepo.findOne({ where: { email: userName } });
  }

  async create(creatUser: CreateUserDto) {
    const user = this.userRepo.create(creatUser);
    return await this.userRepo.save(user);
  }

  async update(id: number, updateUser: UpdateUserDto) {
    return await this.userRepo.update(id, updateUser);
  }
}

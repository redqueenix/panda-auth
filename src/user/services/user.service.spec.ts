import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { UpdateUserDto } from '../../user/dtos/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('find', () => {
    it('should throw NotFoundException when user with given id is not found', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(userService.find(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should return user when user with given id is found', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await userService.find(userId);

      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUsername', () => {
    it('should return user when user with given username is found', async () => {
      const username = 'john@example.com';
      const mockUser = { id: 1, email: username, name: 'John Doe' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await userService.findByUsername(username);

      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should throw ConflictException when user with the same name already exists', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'johnpass123',
      };
      jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(createUserDto as User);
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError(
          'query',
          [],
          'duplicate key value violates unique constraint',
        );
      });

      await expect(userService.create(createUserDto)).rejects.toThrowError(
        ConflictException,
      );
    });

    it('should throw other errors when a non-duplicate-key violation error occurs', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'johnpass123',
      };
      jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(createUserDto as User);
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Some other error'));

      await expect(userService.create(createUserDto)).rejects.toThrowError(
        Error,
      );
    });

    it('should return the user when successfully created', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'johnpass123',
      };
      const mockUser = { id: 1, ...createUserDto };
      jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(createUserDto as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as User);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should call userRepo.update with the provided id and updateUser', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };
      const updateSpy = jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue(undefined);

      await userService.update(userId, updateUserDto);

      expect(updateSpy).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });
});

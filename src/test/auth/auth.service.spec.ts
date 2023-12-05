import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { UserToLoginDto } from '../../auth/dtos/user-to-login.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return UserToLoginDto when username and password are valid', async () => {
      const userName = 'john@example.com';
      const password = 'password123';
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: userName,
        //password: await bcrypt.hash(password, 10),
      };

      jest
        .spyOn(userService, 'findByUsername')
        .mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(userName, password);

      expect(result).toEqual(UserToLoginDto.map(mockUser as User));
    });

    it('should return null when username or password is invalid', async () => {
      const userName = 'john@example.com';
      const password = 'invalidPassword';

      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(userName, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user with accessToken and refreshToken', async () => {
      const user: UserToLoginDto = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      (jwtService.sign as jest.Mock).mockReturnValue('mockedAccessToken');

      const result = await authService.login(user);

      expect(result).toEqual({
        ...user,
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedAccessToken', // Assuming refresh token logic is the same as access token for simplicity
      });
    });
  });

  describe('refresh', () => {
    it('should return new accessToken', async () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword', // Assuming hashed password for simplicity
      };

      (jwtService.sign as jest.Mock).mockReturnValue('mockedNewAccessToken');

      const result = await authService.refresh(user as User);

      expect(result).toEqual({
        accessToken: 'mockedNewAccessToken',
      });
    });
  });
});

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { UserToLoginDto } from '../dtos/user-to-login.dto';
import { REFRESH_TOKEN_EXPIRE_TIME } from '../../commun/constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userName: string, password: string) {
    const user = await this.userService.findByUsername(userName);
    if (user && (await bcrypt.compare(password, user.password))) {
      return UserToLoginDto.map(user);
    }
    return null;
  }
  async login(user: UserToLoginDto) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
      }),
    };
  }

  async refresh(user: User) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtLocalStrategy } from './strategies/jwt-local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserService } from '../user/services/user.service';
import { User } from '../user/entities/user.entity';
import { JWT_SECRET } from '../commun/constants/constants';

@Module({
  providers: [
    AuthService,
    UserService,
    JwtLocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    UserService,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}

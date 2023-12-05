import { User } from '../../user/entities/user.entity';

export class UserToLoginDto {
  id: number;
  name: string;
  email: string;

  public static map(user: User): UserToLoginDto {
    const dto = new UserToLoginDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    return dto;
  }
}

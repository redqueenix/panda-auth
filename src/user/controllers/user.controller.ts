import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'ID of the user', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User successfully retrieved',
  })
  find(@Param('id') id: number) {
    return this.userService.find(id);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
  })
  create(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'ID of the user', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
  })
  update(@Param('id') id: number, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(id, updateUser);
  }
}

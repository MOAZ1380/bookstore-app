import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtRolesGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  getLoggedUser(@Req() req: Request) {
    return this.usersService.getLoggedUserData(req);
  }

  @Patch('updateMyPassword')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  updateMyPassword(@Req() req: Request) {
    return this.usersService.updateLoggedUserPassword(req);
  }

  @Patch('updateMe')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  updateMe(
    @Body()
    UpdateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.updateLoggedUserData(UpdateUserDto, req);
  }

  @Patch('DeleteMyAccount')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  deleteMyAccount(@Req() req: Request) {
    return this.usersService.deleteLoggedUserAccount(req);
  }

  @Get(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}

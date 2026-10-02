import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getInfo(): string {
    return 'Users page placeholder';
  }
}


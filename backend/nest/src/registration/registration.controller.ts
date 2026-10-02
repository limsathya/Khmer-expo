import { Controller, Get } from '@nestjs/common';

@Controller('registration')
export class RegistrationController {
  @Get()
  getInfo(): string {
    return 'Registration page placeholder';
  }
}


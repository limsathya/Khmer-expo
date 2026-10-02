import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  getRoot(): string {
    // Simple health/welcome endpoint
    return 'Welcome to Expo Backend';
  }
}


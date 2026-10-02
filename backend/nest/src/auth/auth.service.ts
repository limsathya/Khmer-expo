import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly config: ConfigService) {}

  validateUser(username: string, password: string): boolean {
    const allowDevLogin = this.config.get<string>('AUTH_ALLOW_DEV_LOGIN') === 'true';
    const isProduction  = this.config.get<string>('NODE_ENV') === 'production';

    if (allowDevLogin && !isProduction) {
      const expectedUser = this.config.get<string>('DEV_ADMIN_USERNAME') ?? '';
      const expectedPass = this.config.get<string>('DEV_ADMIN_PASSWORD') ?? '';
      this.logger.warn(`Dev-mode login attempt for "${username}".`);
      return username === expectedUser && password === expectedPass;
    }

    this.logger.warn(`Refusing credential check for "${username}".`);
    throw new UnauthorizedException('Auth backend not configured.');
  }
}
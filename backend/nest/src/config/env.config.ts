import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString, IsInt, IsNotEmpty, IsOptional, IsString, Min, validateSync,
} from 'class-validator';

export class EnvSchema {
  @IsOptional() @IsString()
  NODE_ENV: string = 'production';

  @IsString() @IsNotEmpty()
  PORT!: string;

  @IsString() @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString() @IsNotEmpty()
  JWT_SECRET!: string;

  @IsOptional() @IsString()
  JWT_EXPIRES_IN: string = '2h';

  @IsString() @IsNotEmpty()
  ENCRYPTION_KEY!: string;

  @IsOptional() @IsString()
  CORS_ORIGIN: string = '*';

  @IsOptional() @IsString()
  REDIS_URL: string = 'redis://localhost:6379';

  @IsOptional() @IsBooleanString()
  AUTH_ALLOW_DEV_LOGIN: string = 'false';

  @IsOptional() @IsString()
  DEV_ADMIN_USERNAME: string = 'admin';

  @IsOptional() @IsString()
  DEV_ADMIN_PASSWORD: string = 'admin';

  @IsOptional() @IsString()
  SEED_ADMIN_EMAIL: string = 'admin@example.com';

  @IsOptional() @IsString()
  SEED_ADMIN_PASSWORD: string = 'password123';

  @IsOptional() @IsInt() @Min(4)
  BCRYPT_ROUNDS: number = 10;
}

export function validateEnv(raw: Record<string, unknown>): EnvSchema {
  const coerced: Record<string, unknown> = { ...raw };
  if (typeof coerced.BCRYPT_ROUNDS === 'string' && coerced.BCRYPT_ROUNDS.length > 0) {
    const n = Number(coerced.BCRYPT_ROUNDS);
    if (!Number.isNaN(n)) coerced.BCRYPT_ROUNDS = n;
  }

  const instance = plainToInstance(EnvSchema, coerced, { enableImplicitConversion: false });
  const errors = validateSync(instance, {
    skipMissingProperties: false, whitelist: false, forbidUnknownValues: false,
  });

  if (errors.length > 0) {
    const lines = errors.map((e) => {
      const keys = Object.keys(e.constraints ?? {});
      const msg = keys.length > 0 ? keys.map((k) => e.constraints![k]).join(', ') : 'invalid';
      return `  - ${e.property}: ${msg}`;
    });
    throw new Error(`Environment validation failed:\n${lines.join('\n')}`);
  }
  return Object.freeze(instance);
}
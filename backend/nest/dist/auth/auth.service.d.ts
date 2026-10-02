import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    validateUser(username: string, password: string): boolean;
}

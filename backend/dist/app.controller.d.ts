import { ConfigService } from '@nestjs/config';
export declare class AppController {
    private readonly config;
    constructor(config: ConfigService);
    getRoot(): string;
}

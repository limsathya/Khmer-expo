"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const helmet = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(helmet());
    const port = process.env.PORT ?? '3000';
    await app.listen(parseInt(port, 10));
    console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map